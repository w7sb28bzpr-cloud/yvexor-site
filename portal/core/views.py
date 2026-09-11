import hashlib
import io
import time
import uuid
from datetime import timedelta
from functools import wraps

import django_otp
import qrcode
import qrcode.image.svg
from django import forms
from django.conf import settings
from django.contrib import messages
from django.contrib.auth import authenticate, login, logout, update_session_auth_hash
from django.contrib.auth.forms import PasswordChangeForm
from django.contrib.auth.decorators import login_required
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from django.db import transaction, IntegrityError
from django.http import HttpResponse, JsonResponse
from django.shortcuts import get_object_or_404, redirect, render
from django.urls import reverse
from django.utils import timezone
from django.views.decorators.http import require_POST, require_GET
from django_otp.plugins.otp_totp.models import TOTPDevice
from .forms import LoginForm, SignupForm, RequestForm, MessageForm, ProjectForm
from .models import User, Organization, Membership, Request, Project, Message, AuditEvent, LoginAttempt, OwnerInvite
from .services import notify_team, notify_client


def audit(user, action, obj=''):
    AuditEvent.objects.create(actor=user if user.is_authenticated else None, action=action, object_id=str(obj))


def limited(request, bucket, identity=''):
    # Fixed server-side window, shared across workers. No email/IP in audit records.
    now = timezone.now()
    address = request.META.get('REMOTE_ADDR', '')
    # Gunicorn is loopback-only; nginx overwrites this header, never appends it.
    if address in ('127.0.0.1', '::1') and request.META.get('HTTP_X_REAL_IP'):
        address = request.META['HTTP_X_REAL_IP']
    raw = bucket + ':' + address
    keys = [(hashlib.sha256(raw.encode()).hexdigest(), 120 if bucket == 'message' else 60)]
    if identity:
        keys.append((hashlib.sha256((bucket + ':' + identity.lower()).encode()).hexdigest(), 60 if bucket == 'message' else 10))
    else:
        keys[0] = (keys[0][0], 10)
    for key, limit in keys:
        if LoginAttempt.objects.filter(key=key, created_at__gt=now-timedelta(minutes=15)).count() >= limit:
            return True
    for key, _ in keys:
        LoginAttempt.objects.create(key=key)
    return False


def staff_verified(user):
    return user.is_authenticated and user.is_staff and user.is_verified()


def portal_required(view):
    @login_required
    @wraps(view)
    def wrapped(request, *args, **kwargs):
        if request.user.is_staff and not request.user.is_verified():
            return redirect('mfa')
        return view(request, *args, **kwargs)
    return wrapped


def team_required(view):
    @portal_required
    @wraps(view)
    def wrapped(request, *args, **kwargs):
        if not staff_verified(request.user):
            return HttpResponse('Accès réservé à YVEXOR.', status=403)
        # This release provisions only the owner. Other roles default to no access.
        if not request.user.is_superuser:
            return HttpResponse('Permissions non attribuées.', status=403)
        return view(request, *args, **kwargs)
    return wrapped


def allowed_requests(user):
    if staff_verified(user) and user.is_superuser:
        return Request.objects.all()
    return Request.objects.filter(organization__membership__user=user)


def allowed_projects(user):
    if staff_verified(user) and user.is_superuser:
        return Project.objects.all()
    return Project.objects.filter(organization__membership__user=user)


def signin(request):
    if request.user.is_authenticated:
        return redirect('admin-home' if request.user.is_staff else 'client-home')
    form = LoginForm(request.POST or None)
    if request.method == 'POST' and form.is_valid():
        email = form.cleaned_data['email'].lower()
        if limited(request, 'login', email):
            form.add_error(None, 'Trop de tentatives. Réessayez dans 15 minutes.')
        else:
            account = User.objects.filter(email__iexact=email).first()
            user = authenticate(request, username=account.username if account else email,
                                password=form.cleaned_data['password'])
            if user:
                login(request, user)
                request.session.set_expiry(settings.SESSION_COOKIE_AGE if form.cleaned_data['remember'] else 0)
                audit(user, 'login.password')
                return redirect('mfa' if user.is_staff else 'client-home')
            form.add_error(None, 'Adresse e-mail ou mot de passe incorrect.')
    return render(request, 'auth.html', {'form': form, 'title': 'Heureux de vous retrouver', 'action': 'Se connecter', 'login_page': True})


def signup(request):
    if request.user.is_authenticated:
        return redirect('client-home')
    form = SignupForm(request.POST or None)
    if request.method == 'POST' and form.is_valid():
        if limited(request, 'signup'):
            form.add_error(None, 'Trop de tentatives. Réessayez dans 15 minutes.')
        else:
            try:
                with transaction.atomic():
                    user = form.save(commit=False)
                    user.username = str(uuid.uuid4())
                    user.save()
                    org = Organization.objects.create(name=(user.first_name + ' ' + user.last_name).strip()[:160])
                    Membership.objects.create(user=user, organization=org)
                    audit(user, 'account.created', org.id)
                    notify_team('Nouveau client : '+org.name, reverse('client-detail',args=[org.pk]))
            except IntegrityError:
                form.add_error('email', 'Cette inscription ne peut pas être terminée. Essayez de vous connecter.')
            else:
                login(request, user, backend='django.contrib.auth.backends.ModelBackend')
                request.session.set_expiry(settings.SESSION_COOKIE_AGE)
                return redirect('client-home')
    return render(request, 'auth.html', {'form': form, 'title': 'Votre espace, vos projets', 'action': 'Créer mon compte', 'signup_page': True})


@require_POST
@login_required
def signout(request):
    audit(request.user, 'logout')
    logout(request)
    return redirect('login')


@login_required
def mfa(request):
    if not request.user.is_staff:
        return HttpResponse(status=403)
    step_up = request.path == '/auth/confirm/'
    if request.user.is_verified() and not step_up:
        return redirect('admin-home')
    device = TOTPDevice.objects.filter(user=request.user).first()
    if not device:
        device = TOTPDevice.objects.create(user=request.user, name='Appareil principal', confirmed=False)
    setup = not device.confirmed
    error = ''
    if request.method == 'POST':
        if limited(request, 'mfa', str(request.user.pk)):
            error = 'Trop de tentatives. Réessayez dans 15 minutes.'
        else:
            with transaction.atomic():
                device = TOTPDevice.objects.select_for_update().get(pk=device.pk)
                if device.verify_is_allowed()[0] and device.verify_token(request.POST.get('code', '')):
                    device.confirmed = True
                    device.save()
                    django_otp.login(request, device)
                    request.session['mfa_at'] = time.time()
                    audit(request.user, 'login.mfa')
                    destination = request.session.pop('reauth_next', '/admin/')
                    return redirect(destination)
                error = 'Code incorrect ou expiré. Essayez le prochain code.'
    return render(request, 'mfa.html', {'setup': setup, 'error': error})


@login_required
@require_GET
def mfa_qr(request):
    if not request.user.is_staff:
        return HttpResponse(status=403)
    device = get_object_or_404(TOTPDevice, user=request.user, confirmed=False)
    picture = qrcode.make(device.config_url, image_factory=qrcode.image.svg.SvgPathImage)
    output = io.BytesIO()
    picture.save(output)
    return HttpResponse(output.getvalue(), content_type='image/svg+xml')


class OwnerForm(forms.Form):
    code = forms.CharField(label="Code d'activation privé", widget=forms.PasswordInput)
    password = forms.CharField(label='Votre mot de passe (12 caractères minimum)', widget=forms.PasswordInput)
    confirmation = forms.CharField(label='Confirmez votre mot de passe', widget=forms.PasswordInput)


def activate_owner(request):
    form = OwnerForm(request.POST or None)
    if request.method == 'POST' and form.is_valid():
        if limited(request, 'owner'):
            form.add_error(None, 'Trop de tentatives. Réessayez dans 15 minutes.')
        elif form.cleaned_data['password'] != form.cleaned_data['confirmation']:
            form.add_error('confirmation', 'Les mots de passe ne correspondent pas.')
        else:
            try:
                validate_password(form.cleaned_data['password'], User(email=settings.OWNER_EMAIL))
            except ValidationError as exc:
                form.add_error('password', exc)
            if not form.errors:
                with transaction.atomic():
                    invite = OwnerInvite.objects.select_for_update().filter(
                        digest=hashlib.sha256(form.cleaned_data['code'].encode()).hexdigest(),
                        used_at__isnull=True, expires_at__gt=timezone.now(), email=settings.OWNER_EMAIL).first()
                    if not invite or User.objects.filter(email__iexact=settings.OWNER_EMAIL).exists():
                        form.add_error(None, 'Code invalide ou expiré.')
                    else:
                        user = User.objects.create_user(username=str(uuid.uuid4()), email=invite.email,
                            password=form.cleaned_data['password'], first_name='Yannick',
                            is_staff=True, is_superuser=True)
                        invite.used_at = timezone.now()
                        invite.save()
                        audit(user, 'owner.activated')
                        login(request, user, backend='django.contrib.auth.backends.ModelBackend')
                        request.session.set_expiry(settings.SESSION_COOKIE_AGE)
                        return redirect('mfa')
    return render(request, 'auth.html', {'form': form, 'title': 'Activer YVEXOR Admin', 'action': 'Activer et sécuriser mon accès'})


def root(request):
    admin_host = request.get_host().split(':')[0] == 'admin.yvexor.com'
    return redirect('admin-home' if admin_host or (request.user.is_authenticated and request.user.is_staff) else 'client-home')


@portal_required
def client_home(request):
    if request.user.is_staff:
        return redirect('admin-home')
    rows = allowed_requests(request.user)
    projects = allowed_projects(request.user)
    unread = Message.objects.filter(request__in=rows, from_team=True, read_at__isnull=True).count()
    org = Organization.objects.filter(membership__user=request.user).first()
    return render(request, 'dashboard.html', {'org': org, 'requests': rows[:5], 'projects': projects[:4],
        'open_count': rows.exclude(status__in=['done', 'refused']).count(),
        'project_count': projects.exclude(status='done').count(), 'unread': unread, 'section': 'home'})


@team_required
def admin_home(request):
    rows = allowed_requests(request.user).select_related('organization')
    recent_messages = Message.objects.filter(from_team=False).select_related('request', 'author').order_by('-created_at')[:5]
    return render(request, 'dashboard.html', {'team': True, 'requests': rows[:8],
        'projects': Project.objects.select_related('organization').order_by('-updated_at')[:4],
        'client_count': Organization.objects.count(), 'open_count': rows.filter(status='new').count(),
        'project_count': Project.objects.exclude(status='done').count(),
        'unread': Message.objects.filter(from_team=False, read_at__isnull=True).count(),
        'recent_messages': recent_messages, 'section': 'home'})


@portal_required
def request_list(request):
    rows = allowed_requests(request.user).select_related('organization')
    term = request.GET.get('q', '')[:160]
    if term:
        rows = rows.filter(title__icontains=term)
    return render(request, 'list.html', {'requests': rows[:100], 'q': term, 'section': 'requests', 'title': 'Demandes', 'team': request.user.is_staff})


@portal_required
def new_request(request):
    if request.user.is_staff:
        return HttpResponse('Créez une demande depuis un compte client pour ce premier lot.', status=403)
    form = RequestForm(request.POST or None)
    if request.method == 'POST' and form.is_valid():
        if limited(request, 'request', str(request.user.pk)):
            form.add_error(None, 'Trop de demandes rapprochées. Réessayez dans 15 minutes.')
        else:
            org = get_object_or_404(Organization, membership__user=request.user)
            with transaction.atomic():
                item = form.save(commit=False)
                item.author = request.user
                item.organization = org
                item.save()
                audit(request.user, 'request.created', item.id)
                notify_team('Nouvelle demande : '+item.title, reverse('request-detail',args=[item.pk]))
            messages.success(request, 'Votre demande a bien été envoyée à YVEXOR.')
            return redirect('request-detail', pk=item.pk)
    return render(request, 'form.html', {'form': form, 'title': 'Une nouvelle idée ?', 'action': 'Envoyer ma demande', 'section': 'requests', 'wizard': True})


@portal_required
def request_detail(request, pk):
    item = get_object_or_404(allowed_requests(request.user).select_related('organization', 'author'), pk=pk)
    form = MessageForm(request.POST or None)
    if request.method == 'POST' and form.is_valid():
        if limited(request, 'message', str(request.user.pk)):
            form.add_error(None, 'Trop de messages rapprochés. Réessayez dans 15 minutes.')
        else:
            with transaction.atomic():
                Message.objects.create(request=item, author=request.user, body=form.cleaned_data['body'], from_team=request.user.is_staff)
                item.save(update_fields=['updated_at'])
                audit(request.user, 'message.sent', item.id)
                if request.user.is_staff:
                    notify_client(item.organization,'Nouveau message YVEXOR : '+item.title,reverse('request-detail',args=[item.pk]))
                else:
                    notify_team('Nouveau message : '+item.title,reverse('request-detail',args=[item.pk]))
            return redirect('request-detail', pk=pk)
    item.thread.filter(from_team=not request.user.is_staff, read_at__isnull=True).update(read_at=timezone.now())
    return render(request, 'request.html', {'item': item, 'form': form,
        'thread': item.thread.select_related('author'), 'team': request.user.is_staff,
          'states': Request.STATES, 'section': 'requests',
          'quotes': item.quotes.all() if request.user.is_staff else item.quotes.filter(versions__isnull=False).distinct(),
        'project': Project.objects.filter(source=item).first()})


@team_required
@require_POST
def request_status(request, pk):
    item = get_object_or_404(Request, pk=pk)
    status = request.POST.get('status')
    if status not in dict(Request.STATES) or status == 'project':
        return HttpResponse(status=400)
    item.status = status
    item.save()
    audit(request.user, 'request.status', pk)
    return redirect('request-detail', pk=pk)


@team_required
@require_POST
def convert(request, pk):
    with transaction.atomic():
        item = get_object_or_404(Request.objects.select_for_update(), pk=pk)
        project, created = Project.objects.get_or_create(source=item, defaults={
            'organization': item.organization, 'name': item.title, 'description': item.body})
        if created:
            item.status = 'project'
            item.save()
            audit(request.user, 'project.created', project.pk)
            notify_client(item.organization,'Votre projet est lancé : '+project.name,reverse('project-detail',args=[project.pk]))
    return redirect('project-detail', pk=project.pk)


@portal_required
def projects(request):
    return render(request, 'list.html', {'projects': allowed_projects(request.user), 'title': 'Projets', 'section': 'projects', 'team': request.user.is_staff})


@portal_required
def project_detail(request, pk):
    project = get_object_or_404(allowed_projects(request.user), pk=pk)
    form = None
    if request.user.is_staff:
        if not request.user.is_superuser:
            return HttpResponse(status=403)
        form = ProjectForm(request.POST or None, instance=project)
        if request.method == 'POST' and form.is_valid():
            form.save()
            audit(request.user, 'project.updated', pk)
            notify_client(project.organization,'Projet mis à jour : '+project.name,reverse('project-detail',args=[pk]))
            messages.success(request, 'Le suivi client a été mis à jour.')
            return redirect('project-detail', pk=pk)
    elif request.method != 'GET':
        return HttpResponse(status=403)
    return render(request, 'project.html', {'project': project, 'form': form, 'team': request.user.is_staff, 'section': 'projects'})


@portal_required
def inbox(request):
    rows = allowed_requests(request.user).filter(thread__isnull=False).distinct().select_related('organization')
    return render(request, 'list.html', {'requests': rows, 'title': 'Messages', 'section': 'messages', 'team': request.user.is_staff})


@team_required
def clients(request):
    term = request.GET.get('q', '')[:160]
    rows = Organization.objects.filter(name__icontains=term).order_by('name')
    return render(request, 'clients.html', {'clients': rows[:100], 'q': term, 'team': True, 'section': 'clients'})


@team_required
def client_detail(request, pk):
    org = get_object_or_404(Organization, pk=pk)
    audit(request.user, 'client.viewed', pk)
    return render(request, 'client.html', {'org': org, 'contacts': User.objects.filter(membership__organization=org),
        'requests': Request.objects.filter(organization=org), 'projects': Project.objects.filter(organization=org),
        'notes': org.internalnote_set.select_related('author').order_by('-created_at'),
        'team': True, 'section': 'clients'})


@portal_required
def account(request):
    form = PasswordChangeForm(request.user, request.POST or None)
    if request.method == 'POST':
        throttled = limited(request, 'password-change', str(request.user.pk))
        if form.is_valid() and not throttled:
            user = form.save()
            update_session_auth_hash(request, user)
            audit(user, 'password.changed')
            messages.success(request, 'Mot de passe modifié. Les anciennes sessions des autres appareils ne sont plus valables.')
            return redirect('account')
        if throttled:
            form.add_error(None, 'Trop de tentatives. Réessayez dans 15 minutes.')
    return render(request, 'account.html', {'org': Organization.objects.filter(membership__user=request.user).first(),
                                           'team': request.user.is_staff, 'section': 'account', 'form': form})


@require_GET
def manifest(request, surface):
    admin = surface == 'admin'
    return JsonResponse({'id': '/' + surface + '/', 'name': 'YVEXOR Admin' if admin else 'Espace Client YVEXOR',
        'short_name': 'YVEXOR Admin' if admin else 'YVEXOR', 'start_url': '/' + surface + '/', 'scope': '/',
        'display': 'standalone', 'background_color': '#030c16', 'theme_color': '#030c16',
        'icons': [{'src': '/static/app-icon-192.png', 'sizes': '192x192', 'type': 'image/png', 'purpose': 'any'},
                  {'src': '/static/app-icon-512.png', 'sizes': '512x512', 'type': 'image/png', 'purpose': 'any maskable'}]},
        content_type='application/manifest+json')


@require_GET
def service_worker(request):
    return HttpResponse((settings.BASE_DIR / 'static' / 'sw.js').read_text(), content_type='application/javascript')


@require_GET
def health(request):
    return JsonResponse({'status': 'ok'})
