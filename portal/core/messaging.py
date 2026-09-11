import uuid
from django import forms
from django.db import transaction
from django.db.models import Count, Max, Q
from django.http import JsonResponse, HttpResponse
from django.shortcuts import get_object_or_404, redirect, render
from django.urls import reverse
from django.utils import timezone
from django.views.decorators.http import require_GET, require_POST
from .models import DirectMessage, Organization, Notification
from .services import notify_client, notify_team
from .views import portal_required, staff_verified, allowed_requests, limited, audit


def organizations(user):
    if staff_verified(user) and user.is_superuser:
        return Organization.objects.all()
    if user.is_staff:
        return Organization.objects.none()
    return Organization.objects.filter(membership__user=user)


def unread_count(user):
    return DirectMessage.objects.filter(organization__in=organizations(user), from_team=not user.is_staff, read_at__isnull=True).count()


class ChatForm(forms.Form):
    body = forms.CharField(max_length=10000, label='Votre message', widget=forms.Textarea(attrs={'rows': 1, 'placeholder': 'Écrivez votre message…', 'enterkeyhint': 'enter'}))
    client_nonce = forms.UUIDField(initial=uuid.uuid4, widget=forms.HiddenInput)


def serialize(row, user):
    return {'id': row.pk, 'body': row.body, 'mine': row.author_id == user.pk,
            'author': 'Yannick · YVEXOR' if row.from_team else row.author.first_name or 'Client',
            'date': timezone.localtime(row.created_at).strftime('%d/%m/%Y %H:%M'), 'read': bool(row.read_at)}


@portal_required
@require_GET
def inbox(request):
    orgs = organizations(request.user).annotate(last_activity=Max('direct_messages__created_at'),
        new_count=Count('direct_messages', filter=Q(direct_messages__from_team=not request.user.is_staff, direct_messages__read_at__isnull=True)))
    term = request.GET.get('q', '')[:160]
    if term and request.user.is_staff:
        orgs = orgs.filter(name__icontains=term)
    orgs = list(orgs.order_by('-last_activity', 'name')[:100])
    for org in orgs:
        org.last_message = org.direct_messages.order_by('-id').first()
    legacy = allowed_requests(request.user).filter(thread__isnull=False).distinct()[:30]
    return render(request, 'inbox.html', {'conversations': orgs, 'legacy_requests': legacy, 'q': term,
        'team': request.user.is_staff, 'section': 'messages'})


@portal_required
def conversation(request, pk):
    org = get_object_or_404(organizations(request.user), pk=pk)
    form = ChatForm(request.POST or None)
    wants_json = request.headers.get('Accept') == 'application/json'
    if request.method == 'POST':
        if form.is_valid():
            existing = DirectMessage.objects.filter(author=request.user, client_nonce=form.cleaned_data['client_nonce']).first()
            if existing and existing.organization_id != org.pk:
                return HttpResponse(status=409)
            if existing and existing.body != form.cleaned_data['body']:
                return JsonResponse({'error': 'Cet envoi a déjà été reçu avec un autre texte. Copiez votre nouveau texte puis rouvrez la discussion avant de le renvoyer.'}, status=409)
            if not existing and limited(request, 'message', str(request.user.pk)):
                form.add_error(None, 'Trop de messages rapprochés. Réessayez dans 15 minutes.')
            else:
                with transaction.atomic():
                    row, created = DirectMessage.objects.get_or_create(author=request.user,
                        client_nonce=form.cleaned_data['client_nonce'], defaults={'organization': org,
                        'body': form.cleaned_data['body'], 'from_team': request.user.is_staff})
                    if row.organization_id != org.pk:
                        return HttpResponse(status=409)
                    if created:
                        path = reverse('conversation', args=[org.pk])
                        audit(request.user, 'chat.sent', org.pk)
                        if request.user.is_staff:
                            notify_client(org, 'Yannick vous a envoyé un message', path, exclude=request.user.pk)
                        else:
                            notify_team('Message de ' + (request.user.first_name or org.name), path, exclude=request.user.pk)
                if wants_json:
                    return JsonResponse({'message': serialize(row, request.user), 'nonce': str(uuid.uuid4())})
                return redirect('conversation', pk=pk)
        if wants_json:
            return JsonResponse({'error': ' '.join(str(error) for errors in form.errors.values() for error in errors)}, status=400)
    elif request.method != 'GET':
        return HttpResponse(status=405)
    rows = list(org.direct_messages.select_related('author').order_by('-id')[:100])
    rows.reverse()
    return render(request, 'conversation.html', {'org': org, 'chat_rows': rows, 'form': form,
        'last_id': rows[-1].pk if rows else 0, 'first_id': rows[0].pk if rows else 0,
        'has_older': len(rows) == 100, 'section': 'messages', 'team': request.user.is_staff, 'chat_mode': True})


@portal_required
@require_GET
def updates(request, pk):
    org = get_object_or_404(organizations(request.user), pk=pk)
    try:
        after = max(0, int(request.GET.get('after', '0')))
        before = max(0, int(request.GET.get('before', '0')))
        if max(after, before) > 9223372036854775807:
            raise ValueError
    except ValueError:
        return JsonResponse({'error': 'Curseur invalide.'}, status=400)
    query = org.direct_messages.select_related('author')
    if before:
        rows = list(query.filter(id__lt=before).order_by('-id')[:100]); rows.reverse()
    else:
        rows = list(query.filter(id__gt=after).order_by('id')[:100])
    last_read = org.direct_messages.filter(author=request.user, read_at__isnull=False).order_by('-id').values_list('id', flat=True).first() or 0
    return JsonResponse({'messages': [serialize(row, request.user) for row in rows], 'last_read': last_read, 'has_more': len(rows) == 100})


@portal_required
@require_POST
def mark_read(request, pk):
    org = get_object_or_404(organizations(request.user), pk=pk)
    try:
        last = int(request.POST.get('through', '0'))
        if not 0 <= last <= 9223372036854775807:
            raise ValueError
    except ValueError:
        return JsonResponse({'error': 'Curseur invalide.'}, status=400)
    now = timezone.now()
    visible = org.direct_messages.filter(id__lte=last)
    visible.filter(from_team=not request.user.is_staff, read_at__isnull=True).update(read_at=now)
    last_visible = visible.order_by('-id').first()
    if last_visible and not org.direct_messages.filter(id__gt=last, from_team=not request.user.is_staff).exists():
        Notification.objects.filter(user=request.user, path=reverse('conversation', args=[org.pk]),
            created_at__lte=now, read_at__isnull=True).update(read_at=now)
    return JsonResponse({'ok': True})
