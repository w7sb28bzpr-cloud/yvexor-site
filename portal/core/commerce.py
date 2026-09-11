import time
from functools import wraps
from urllib.parse import urlsplit
from django.contrib import messages
from django.db import transaction
from django.http import HttpResponse
from django.shortcuts import get_object_or_404, redirect, render
from django.urls import reverse
from django.utils import timezone
from django.views.decorators.http import require_POST
from .models import Quote, QuoteVersion, QuoteDecision, Organization, Solution
from .commerce_forms import QuoteForm, ItemsFormSet, SolutionForm
from .services import quote_snapshot, notify_client, notify_team
from .views import portal_required, team_required, allowed_requests, staff_verified, audit


def fresh_admin(view):
    @team_required
    @wraps(view)
    def wrapped(request, *args, **kwargs):
        if time.time() - request.session.get('mfa_at', 0) > 15 * 60:
            ref = urlsplit(request.META.get('HTTP_REFERER', ''))
            target = ref.path if ref.netloc == request.get_host() and ref.path.startswith('/') and not ref.path.startswith('//') else '/admin/'
            request.session['reauth_next'] = target
            return redirect('mfa-confirm')
        return view(request, *args, **kwargs)
    return wrapped


def allowed_quotes(user):
    rows = Quote.objects.filter(request__in=allowed_requests(user))
    if not (staff_verified(user) and user.is_superuser):
        rows = rows.filter(versions__isnull=False).distinct()
    return rows


@portal_required
def quotes(request):
    return render(request, 'quotes.html', {'quotes':allowed_quotes(request.user).select_related('request__organization').order_by('-updated_at'),
        'team':request.user.is_staff,'section':'quotes'})


@fresh_admin
def quote_edit(request, request_id=None, pk=None):
    quote = get_object_or_404(Quote, pk=pk) if pk else Quote(request=get_object_or_404(allowed_requests(request.user), pk=request_id))
    if quote.status == 'accepted':
        return HttpResponse('Ce devis est accepté et ne peut plus être modifié.', status=409)
    initial = {'title':quote.request.title, 'client_details':quote.request.organization.name} if not pk else None
    form = QuoteForm(request.POST or None, instance=quote, initial=initial)
    items = ItemsFormSet(request.POST or None, instance=quote, prefix='items')
    if request.method == 'POST' and form.is_valid() and items.is_valid():
        with transaction.atomic():
            if pk:
                locked = Quote.objects.select_for_update().get(pk=pk)
                if locked.status == 'accepted':
                    return HttpResponse('Ce devis vient d’être accepté.', status=409)
            saved = form.save(commit=False)
            saved.status = 'draft'
            saved.save()
            items.instance = saved
            items.save()
            audit(request.user, 'quote.draft_saved', saved.pk)
        return redirect('quote-detail', pk=saved.pk)
    return render(request, 'quote_form.html', {'form':form,'items':items,'quote':quote,'team':True,'section':'quotes'})


@portal_required
def quote_detail(request, pk):
    quote = get_object_or_404(allowed_quotes(request.user).select_related('request__organization'), pk=pk)
    version = quote.versions.first()
    snapshot = quote_snapshot(quote) if request.user.is_staff and quote.status == 'draft' else version.snapshot if version else None
    can_decide = (not request.user.is_staff and quote.status == 'sent' and version and
                  version.snapshot['valid_until'] >= timezone.localdate().isoformat() and request.user.email_verified)
    return render(request, 'quote.html', {'quote':quote,'snapshot':snapshot,'version':version,
        'versions':quote.versions.all(),'can_decide':can_decide,'team':request.user.is_staff,'section':'quotes'})


@fresh_admin
@require_POST
def quote_send(request, pk):
    if request.POST.get('confirm') != 'yes':
        return HttpResponse('Confirmez la vérification des montants et des mentions avant l’envoi.', status=400)
    with transaction.atomic():
        quote = get_object_or_404(Quote.objects.select_for_update(), pk=pk)
        if quote.status != 'draft' or not quote.items.exists() or quote.valid_until < timezone.localdate():
            return HttpResponse('Le devis ne peut pas être envoyé dans cet état.', status=409)
        previous = quote.versions.first()
        version = QuoteVersion.objects.create(quote=quote, number=previous.number+1 if previous else 1,
            snapshot=quote_snapshot(quote), sent_by=request.user)
        quote.status = 'sent'
        quote.save(update_fields=['status','updated_at'])
        audit(request.user, 'quote.sent', version.pk)
        notify_client(quote.request.organization,'Nouveau devis : '+quote.title,reverse('quote-detail',args=[quote.pk]))
    messages.success(request, 'La version du devis est figée et disponible dans l’espace client.')
    return redirect('quote-detail', pk=pk)


@portal_required
@require_POST
def quote_decide(request, pk):
    if request.user.is_staff or not request.user.email_verified:
        return HttpResponse('Une adresse e-mail vérifiée est nécessaire pour cette action client.', status=403)
    action = request.POST.get('decision')
    if action not in ['accepted','refused'] or request.POST.get('confirm') != 'yes':
        return HttpResponse('Confirmez explicitement votre décision.',status=400)
    with transaction.atomic():
        quote = get_object_or_404(Quote.objects.filter(pk__in=allowed_quotes(request.user).values('pk')).select_for_update(), pk=pk)
        version = quote.versions.first()
        if quote.status != 'sent' or not version or str(version.pk) != request.POST.get('version'):
            return HttpResponse('Cette version n’est plus en attente. Rechargez le devis.',status=409)
        if version.snapshot['valid_until'] < timezone.localdate().isoformat():
            return HttpResponse('Ce devis a expiré. Demandez une nouvelle proposition.', status=409)
        QuoteDecision.objects.create(version=version,user=request.user,decision=action)
        quote.status = action
        quote.save(update_fields=['status','updated_at'])
        audit(request.user, 'quote.'+action,version.pk)
        notify_team('Devis '+('accepté' if action == 'accepted' else 'refusé')+' : '+quote.title,
                    reverse('quote-detail',args=[pk]))
    messages.success(request,'Votre décision a été enregistrée avec la version exacte du devis.')
    return redirect('quote-detail', pk=pk)


@portal_required
def quote_document(request, pk, version_id):
    quote = get_object_or_404(allowed_quotes(request.user),pk=pk)
    version = get_object_or_404(QuoteVersion,quote=quote,pk=version_id)
    audit(request.user,'quote.document_viewed',version.pk)
    return render(request,'quote_document.html',{'snapshot':version.snapshot,'version':version})


@portal_required
def solutions(request):
    rows = Solution.objects.all() if request.user.is_staff and request.user.is_superuser else Solution.objects.filter(organization__membership__user=request.user)
    return render(request,'solutions.html',{'solutions':rows.select_related('organization'),'team':request.user.is_staff,'section':'solutions'})


@team_required
def solution_edit(request, organization_id, pk=None):
    org = get_object_or_404(Organization,pk=organization_id)
    item = get_object_or_404(Solution,pk=pk,organization=org) if pk else Solution(organization=org)
    form = SolutionForm(request.POST or None,instance=item)
    if request.method == 'POST' and form.is_valid():
        form.save()
        audit(request.user,'solution.saved',item.pk)
        notify_client(org,'Votre solution est disponible : '+item.name,reverse('solutions'))
        return redirect('solutions')
    return render(request,'form.html',{'form':form,'title':'Solution · '+org.name,'action':'Enregistrer la solution','team':True,'section':'solutions'})
