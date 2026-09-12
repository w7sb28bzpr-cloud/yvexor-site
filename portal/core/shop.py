import uuid
from django.contrib import messages
from django.core import signing
from django.core.exceptions import ValidationError, PermissionDenied
from django.core.paginator import Paginator
from django.db import transaction
from django.db.models import Q
from django.http import JsonResponse, HttpResponse, FileResponse
from django.shortcuts import get_object_or_404, redirect, render
from django.urls import reverse
from django.utils import timezone
from django.views.decorators.http import require_GET, require_POST
from .models import (Organization, Product, ProductImage, Category, Wallet, WalletTransaction, Order,
    PaymentRequest, PaymentStatusHistory, ShopEvent)
from .views import portal_required, staff_verified, team_required
from .commerce import fresh_admin
from .shop_services import (public_products, cart_rows, cart_totals, cart_fingerprint, checkout,
    adjust_wallet, transition_order, event, send_payment, pay_request, payment_status, refund_service)
from .shop_forms import ProductForm, CategoryForm, ImageUploadForm, AdjustmentForm, PaymentForm, CheckoutForm
from .shop_images import store_image, image_path


def owner(user):
    return staff_verified(user) and user.is_superuser


def org_for(request, pk=None):
    if owner(request.user) and pk:
        return get_object_or_404(Organization, pk=pk)
    if request.user.is_staff:
        raise PermissionDenied('Sélectionnez une fiche client.')
    rows = Organization.objects.filter(membership__user=request.user)
    return get_object_or_404(rows,pk=pk) if pk else get_object_or_404(rows)


def visible_to(request, query):
    if owner(request.user):
        return query
    if request.user.is_staff:
        return query.none()
    return query.filter(organization__membership__user=request.user)


def page(request, template, **ctx):
    return render(request, 'shop/' + template + '.html', {'team':request.user.is_staff, 'section':'shop', **ctx})


def filtered_products(request, query):
    term = request.GET.get('q','')[:160]
    if term:
        query = query.filter(Q(name__icontains=term) | Q(sku__icontains=term))
    category = request.GET.get('category','')[:100]
    if category:
        query = query.filter(category__slug=category)
    if request.GET.get('featured') == '1':
        query = query.filter(featured=True)
    if request.GET.get('available') == '1':
        query = query.filter(availability='AVAILABLE', purchase_with_credits_enabled=True).filter(Q(stock_tracking_enabled=False) | Q(stock_quantity__gt=0))
    return query


def serialize_product(p):
    photos = [{'url':reverse('shop-image', args=[i.pk]),'alt':i.alt} for i in p.images.all() if i.active]
    return {'name':p.name,'slug':p.slug,'sku':p.sku,'category':p.category.name,'short_description':p.short_description,
        'description':p.description,'price_cents':p.price_cents,'credits_cents':p.credits_cents,
        'tax_percent':str(p.tax_percent),'shipping_cents':p.shipping_cents,'features':p.features,
        'availability': 'Rupture de stock' if p.stock_tracking_enabled and p.stock_quantity == 0 and p.availability != 'PREORDER' else p.get_availability_display(),
        'available':bool(p.available),'images':photos,'url':reverse('shop-product', args=[p.slug])}


@require_GET
def catalogue_api(request):
    rows = filtered_products(request, public_products()).select_related('category').prefetch_related('images')
    if request.GET.get('slug'):
        rows = rows.filter(slug=request.GET['slug'][:180])
    paginated = Paginator(rows, 24).get_page(request.GET.get('page',1))
    response = JsonResponse({'products':[serialize_product(p) for p in paginated],
        'page':paginated.number,'pages':paginated.paginator.num_pages,
        'categories':list(Category.objects.filter(active=True).values('slug','name'))})
    origin = request.headers.get('Origin','')
    if origin in ('https://yvexor.com','https://www.yvexor.com'):
        response['Access-Control-Allow-Origin'] = origin
        response['Vary'] = 'Origin'
    # No cookies, account data, drafts or redirects in this public API.
    return response


@require_GET
def photo(request, pk):
    image = get_object_or_404(ProductImage.objects.select_related('product__category'), pk=pk, active=True)
    if not image.product.is_public and not owner(request.user):
        return HttpResponse(status=404)
    path = image_path(image.storage_name)
    if not path.is_file():
        return HttpResponse(status=404)
    return FileResponse(path.open('rb'), content_type='image/webp')


@portal_required
def catalogue(request):
    products = filtered_products(request, public_products()).select_related('category').prefetch_related('images')
    return page(request,'catalogue', products=Paginator(products,24).get_page(request.GET.get('page')), categories=Category.objects.filter(active=True))


@portal_required
def product_detail(request, slug):
    p = get_object_or_404(public_products(), slug=slug)
    return page(request,'product', product=p, photos=p.images.filter(active=True))


@portal_required
@require_POST
def cart_add(request, pk):
    get_object_or_404(public_products(), pk=pk)
    cart = request.session.get('shop_cart', {})
    try:
        q = int(request.POST.get('quantity','1'))
        if not 0 <= q <= 99 or len(cart) > 30:
            raise ValueError
        if q:
            cart[str(pk)] = q
        else:
            cart.pop(str(pk),None)
        request.session['shop_cart'] = cart
        request.session.pop('checkout_key',None)
    except ValueError:
        messages.error(request,'Quantité invalide.')
    return redirect('shop-cart')


@portal_required
def cart(request):
    if request.user.is_staff:
        return HttpResponse('Les achats sont réservés aux comptes clients.', status=403)
    org = org_for(request)
    wallet, _ = Wallet.objects.get_or_create(organization=org)
    cart_data = request.session.get('shop_cart',{})
    error = ''
    rows = []
    total = credits = shipping = 0
    form = CheckoutForm(request.POST or None)
    # A retry can arrive after a successful checkout cleared the session cart.
    if request.method == 'POST' and form.is_valid():
        try:
            data = signing.loads(form.cleaned_data['token'], salt='checkout', max_age=1800)
            if data['user'] != request.user.pk:
                raise signing.BadSignature
            order = checkout(org, request.user, data['cart'], form.cleaned_data['address'], uuid.UUID(data['key']), data['fingerprint'])
            request.session.pop('shop_cart',None)
            request.session.pop('checkout_key',None)
            return redirect('shop-order',pk=order.pk)
        except (signing.BadSignature, KeyError, ValueError):
            error = 'Confirmation expirée. Rechargez votre panier.'
        except ValidationError as exc:
            error = ' '.join(exc.messages)
    try:
        rows = cart_rows(cart_data)
        total, credits, shipping = cart_totals(rows)
        key = request.session.get('checkout_key') or str(uuid.uuid4())
        request.session['checkout_key'] = key
        token = signing.dumps({'key':key,'cart':cart_data,'fingerprint':cart_fingerprint(rows),'user':request.user.pk}, salt='checkout')
        if request.method != 'POST':
            form = CheckoutForm(initial={'token':token})
    except ValidationError as exc:
        if cart_data:
            error = ' '.join(exc.messages)
    return page(request,'cart', rows=rows, form=form, total=total, credits=credits, shipping=shipping,
        balance=wallet.balance, after=wallet.balance-credits, missing=max(0,credits-wallet.balance), error=error, raw_cart=cart_data)


@portal_required
@require_POST
def clear_cart(request):
    request.session.pop('shop_cart',None)
    request.session.pop('checkout_key',None)
    return redirect('shop-cart')


@portal_required
def orders(request):
    rows = visible_to(request, Order.objects.all()).select_related('organization')
    if request.GET.get('status') in dict(Order.STATES):
        rows = rows.filter(status=request.GET['status'])
    if owner(request.user) and request.GET.get('org'):
        rows = rows.filter(organization_id=request.GET['org'])
    return page(request,'orders', orders=Paginator(rows,30).get_page(request.GET.get('page')), states=Order.STATES)


@portal_required
def order_detail(request, pk):
    row = get_object_or_404(visible_to(request,Order.objects.all()), pk=pk)
    return page(request,'order', order=row, states=Order.STATES)


@fresh_admin
@require_POST
def order_change(request, pk):
    get_object_or_404(Order,pk=pk)
    try:
        transition_order(pk, request.user, request.POST.get('status'), request.POST.get('reason','')[:500], request.POST.get('restock') == 'on')
    except ValidationError as exc:
        messages.error(request,' '.join(exc.messages))
    return redirect('shop-order',pk=pk)


@portal_required
def wallet_view(request, pk=None):
    if request.user.is_staff and not pk:
        return redirect('clients')
    org = org_for(request,pk)
    wallet, _ = Wallet.objects.get_or_create(organization=org)
    rows = wallet.transactions.all()
    if request.GET.get('type') in dict(WalletTransaction.TYPES):
        rows = rows.filter(type=request.GET['type'])
    return page(request,'wallet', org=org, wallet=wallet, balance=wallet.balance,
        entries=Paginator(rows,30).get_page(request.GET.get('page')), types=WalletTransaction.TYPES,
        form=AdjustmentForm(), payments=PaymentRequest.objects.filter(organization=org).exclude(status='DRAFT')[:20])


@portal_required
def entry_detail(request, pk):
    rows = WalletTransaction.objects.all()
    if not owner(request.user):
        rows = rows.filter(wallet__organization__membership__user=request.user, created_by__isnull=False)
    entry = get_object_or_404(rows,pk=pk)
    return page(request,'entry', entry=entry)


@fresh_admin
@require_POST
def wallet_adjust(request, pk):
    org = get_object_or_404(Organization,pk=pk)
    form = AdjustmentForm(request.POST)
    if form.is_valid():
        try:
            adjust_wallet(org,request.user,int(form.cleaned_data['amount']*100),form.cleaned_data['reason'],form.cleaned_data['key'])
            messages.success(request,'Écriture enregistrée dans le portefeuille et le journal.')
        except ValidationError as exc:
            messages.error(request,' '.join(exc.messages))
    else:
        messages.error(request,'Montant, motif ou référence invalide.')
    return redirect('shop-client-wallet',pk=pk)


@portal_required
def topup(request):
    return page(request,'topup')


@fresh_admin
def payment_new(request, pk):
    org = get_object_or_404(Organization,pk=pk)
    form = PaymentForm(request.POST or None, organization=org, initial={'project':request.GET.get('project'),'quote':request.GET.get('quote')})
    if request.method == 'POST' and form.is_valid():
        with transaction.atomic():
            p = form.save(commit=False)
            p.organization = org
            p.created_by = request.user
            p.amount_cents = p.credits_cents = int(form.cleaned_data['amount']*100)
            p.save()
            payment_status(p,request.user,'DRAFT','Brouillon créé')
        return redirect('shop-payment',pk=p.pk)
    return page(request,'form',form=form,title='Demander un paiement · '+org.name)


@portal_required
def payments(request):
    rows = visible_to(request,PaymentRequest.objects.all())
    if not owner(request.user):
        rows = rows.exclude(status='DRAFT')
    return page(request,'payments', payments=Paginator(rows,30).get_page(request.GET.get('page')))


@portal_required
def payment_detail(request, pk):
    rows = visible_to(request,PaymentRequest.objects.all())
    if not owner(request.user):
        rows = rows.exclude(status='DRAFT')
    p = get_object_or_404(rows,pk=pk)
    with transaction.atomic():
        p = PaymentRequest.objects.select_for_update().get(pk=pk)
        if p.status in ('SENT','VIEWED') and p.expires_at and p.expires_at <= timezone.now():
            payment_status(p,request.user,'EXPIRED','Date d’expiration atteinte')
        elif not request.user.is_staff and p.status == 'SENT':
            p.viewed_at = timezone.now()
            payment_status(p,request.user,'VIEWED','Demande consultée')
    wallet,_ = Wallet.objects.get_or_create(organization=p.organization)
    return page(request,'payment',payment=p,balance=wallet.balance,after=wallet.balance-p.credits_cents,
        missing=max(0,p.credits_cents-wallet.balance),can_pay=p.status in ('SENT','VIEWED'))


@fresh_admin
@require_POST
def payment_manage(request, pk):
    get_object_or_404(PaymentRequest,pk=pk)
    try:
        if request.POST.get('action') == 'send':
            send_payment(pk,request.user)
        elif request.POST.get('action') == 'cancel':
            with transaction.atomic():
                p = PaymentRequest.objects.select_for_update().get(pk=pk)
                reason = request.POST.get('reason','').strip()[:500]
                if not reason or p.status not in ('DRAFT','SENT','VIEWED','EXPIRED'):
                    raise ValidationError('Annulation impossible ou motif manquant.')
                payment_status(p,request.user,'CANCELLED',reason)
        elif request.POST.get('action') == 'refund':
            p = PaymentRequest.objects.get(pk=pk,status='PAID')
            refund_service(p.organization,request.user,p.debit_id,request.POST.get('reason','')[:500])
        else:
            return HttpResponse(status=400)
    except ValidationError as exc:
        messages.error(request,' '.join(exc.messages))
    return redirect('shop-payment',pk=pk)


@portal_required
@require_POST
def payment_pay(request, pk):
    if request.user.is_staff:
        return HttpResponse(status=403)
    org = org_for(request)
    get_object_or_404(PaymentRequest,pk=pk,organization=org)
    if request.POST.get('confirm') != 'yes':
        return HttpResponse('Confirmation requise.',status=400)
    try:
        pay_request(org,request.user,pk)
    except ValidationError as exc:
        messages.error(request,' '.join(exc.messages))
    return redirect('shop-payment',pk=pk)


@team_required
def admin_products(request):
    rows = filtered_products(request,Product.objects.all())
    if request.GET.get('status') in dict(Product.STATES):
        rows = rows.filter(status=request.GET['status'])
    return page(request,'admin_products', products=Paginator(rows,30).get_page(request.GET.get('page')))


@fresh_admin
def product_edit(request, pk=None):
    # Hold the same product lock as checkout: editing stock cannot overwrite a concurrent sale.
    with transaction.atomic():
        p = get_object_or_404(Product.objects.select_for_update(),pk=pk) if pk else Product()
        before = {k:str(getattr(p,k)) for k in ('price_cents','credits_cents','stock_quantity','sku','status','availability')} if pk else {}
        form = ProductForm(request.POST or None,instance=p)
        if request.method == 'POST' and form.is_valid():
            p = form.save()
            after = {k:str(getattr(p,k)) for k in before}
            event(request.user,'product.updated' if pk else 'product.created',p,before=before,after=after)
            return redirect('shop-product-edit',pk=p.pk)
    return page(request,'product_form', form=form, product=p if pk else None, image_form=ImageUploadForm(),
        logs=ShopEvent.objects.filter(reference=str(pk))[:30] if pk else [])


@fresh_admin
@require_POST
def product_action(request, pk):
    with transaction.atomic():
        p = get_object_or_404(Product.objects.select_for_update(),pk=pk)
        action = request.POST.get('action')
        if action == 'duplicate':
            source = p.pk
            p.pk = uuid.uuid4()
            p._state.adding = True
            p.slug = p.slug[:140] + '-' + p.pk.hex[:8]
            p.sku = p.sku[:60] + '-' + p.pk.hex[:8]
            p.name = (p.name[:150] + ' (copie)')
            p.stock_quantity = 0 if p.stock_tracking_enabled else None
            p.status = 'DRAFT'
            p.published_at = None
            p.save(force_insert=True)
            event(request.user,'product.duplicated',p,source=str(source))
        elif action in ('publish','unpublish','archive'):
            p.status = {'publish':'PUBLISHED','unpublish':'DRAFT','archive':'ARCHIVED'}[action]
            if action == 'publish':
                p.published_at = timezone.now()
            p.save()
            event(request.user,'product.'+action,p)
        else:
            return HttpResponse(status=400)
    return redirect('shop-product-edit',pk=p.pk)


@team_required
def product_preview(request, pk):
    p = get_object_or_404(Product,pk=pk)
    return page(request,'product',product=p,photos=p.images.filter(active=True),preview=True)


@fresh_admin
@require_POST
def image_upload(request, pk):
    p = get_object_or_404(Product,pk=pk)
    form = ImageUploadForm(request.POST,request.FILES)
    if form.is_valid():
        try:
            with transaction.atomic():
                Product.objects.select_for_update().get(pk=pk)
                if p.images.filter(active=True).count() >= 12:
                    raise ValidationError('Maximum 12 photos par article.')
                name = store_image(form.cleaned_data['photo'])
                image = ProductImage.objects.create(product=p,storage_name=name,alt=form.cleaned_data['alt'],position=form.cleaned_data['position'])
                event(request.user,'product.image_added',p,image=str(image.pk))
        except ValidationError as exc:
            messages.error(request,' '.join(exc.messages))
    else:
        messages.error(request,'Photo ou description invalide.')
    return redirect('shop-product-edit',pk=pk)


@fresh_admin
@require_POST
def image_update(request, pk):
    image = get_object_or_404(ProductImage,pk=pk)
    try:
        position = int(request.POST.get('position','0'))
        if not 0 <= position <= 1000:
            raise ValueError
        with transaction.atomic():
            image.position = position
            image.alt = request.POST.get('alt',image.alt)[:240]
            image.active = request.POST.get('action') != 'remove'
            image.save()
            event(request.user,'product.image_updated',image.product,image=str(pk),active=image.active,position=position)
    except ValueError:
        messages.error(request,'Ordre invalide.')
    return redirect('shop-product-edit',pk=image.product_id)


@fresh_admin
def categories(request, pk=None):
    category = get_object_or_404(Category,pk=pk) if pk else None
    form = CategoryForm(request.POST or None,instance=category)
    if request.method == 'POST' and form.is_valid():
        with transaction.atomic():
            saved = form.save()
            event(request.user,'category.saved',saved,active=saved.active,name=saved.name)
        return redirect('shop-categories')
    return page(request,'categories',form=form,categories=Category.objects.all())
