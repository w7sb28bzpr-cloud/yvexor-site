import hashlib
import json
from decimal import Decimal, ROUND_HALF_UP
from django.core.exceptions import ValidationError
from django.db import transaction
from django.db.models import Sum
from django.urls import reverse
from django.utils import timezone
from .models import (Wallet, WalletTransaction, Product, Order, OrderItem, OrderStatusHistory,
    PaymentRequest, PaymentStatusHistory, ShopEvent, DirectMessage)
from .services import notify_client, notify_team


def event(actor, action, obj, **details):
    return ShopEvent.objects.create(actor=actor, action=action, reference=str(obj.pk), details=details)


def public_products():
    return Product.objects.filter(status='PUBLISHED', category__active=True, published_at__lte=timezone.now())


def locked_wallet(org):
    # Unique organization constraint plus row lock serialize every ledger writer.
    wallet, _ = Wallet.objects.get_or_create(organization=org)
    wallet = Wallet.objects.select_for_update().get(pk=wallet.pk)
    if wallet.status != 'ACTIVE':
        raise ValidationError('Ce portefeuille est suspendu. Contactez YVEXOR.')
    return wallet


def post_entry(wallet, actor, amount, kind, key, ref_type, ref, reason, reversal=None):
    if not isinstance(amount, int) or not amount or abs(amount) > 100000000:
        raise ValidationError('Montant invalide.')
    if not reason.strip():
        raise ValidationError('Un motif est obligatoire.')
    existing = WalletTransaction.objects.filter(idempotency_key=key).first()
    if existing:
        if (existing.wallet_id, existing.amount_cents, existing.type, existing.reference_id) != (wallet.pk, amount, kind, str(ref)):
            raise ValidationError('Référence déjà utilisée pour une autre opération.')
        return existing
    if wallet.balance + amount < 0:
        raise ValidationError('Solde insuffisant. Aucun crédit n’a été débité.')
    entry = WalletTransaction.objects.create(wallet=wallet, created_by=actor, amount_cents=amount,
        type=kind, idempotency_key=key, reference_type=ref_type, reference_id=str(ref),
        description=reason[:500], reversal_of=reversal)
    event(actor, 'wallet.' + kind.lower(), entry, amount_cents=amount, organization=str(wallet.organization_id), reason=reason[:500])
    return entry


@transaction.atomic
def adjust_wallet(org, actor, amount, reason, key):
    wallet = locked_wallet(org)
    return post_entry(wallet, actor, amount, 'ADJUSTMENT', 'adjust:' + str(key), 'organization', org.pk, reason)


def cart_rows(cart, lock=False):
    if not isinstance(cart, dict) or not 1 <= len(cart) <= 30:
        raise ValidationError('Votre panier est vide ou trop volumineux.')
    query = Product.objects.order_by('pk')
    if lock:
        query = query.select_for_update()
    try:
        products = list(query.filter(pk__in=cart))
    except (ValueError, ValidationError):
        raise ValidationError('Panier invalide.')
    if len(products) != len(cart):
        raise ValidationError('Un article n’est plus disponible.')
    rows = []
    for p in products:
        q = cart[str(p.pk)]
        if type(q) is not int or not 1 <= q <= 99:
            raise ValidationError('Quantité invalide.')
        if not p.available:
            raise ValidationError(p.name + ' n’est pas disponible à l’achat.')
        preorder = p.availability == 'PREORDER' and p.preorder_enabled
        if p.stock_tracking_enabled and not preorder and q > p.stock_quantity:
            raise ValidationError('Stock insuffisant pour ' + p.name + '.')
        rows.append({'product': p, 'quantity': q, 'total': p.price_cents * q, 'credits': p.credits_cents * q,
            'shipping': p.shipping_cents * q, 'stock_decremented': p.stock_tracking_enabled and not preorder})
    return rows


def cart_totals(rows):
    shipping = sum(r['shipping'] for r in rows)
    return (sum(r['total'] for r in rows) + shipping, sum(r['credits'] for r in rows) + shipping, shipping)


def cart_fingerprint(rows):
    values = [(str(r['product'].pk), r['quantity'], r['product'].price_cents, r['product'].credits_cents,
        str(r['product'].tax_percent), r['product'].shipping_cents) for r in rows]
    return hashlib.sha256(json.dumps(values).encode()).hexdigest()


def order_status(order, actor, status, reason):
    order.status = status
    order.save(update_fields=['status'])
    OrderStatusHistory.objects.create(order=order, actor=actor, status=status, reason=reason)
    event(actor, 'order.' + status.lower(), order, reason=reason)


@transaction.atomic
def checkout(org, actor, cart, address, key, fingerprint):
    wallet = locked_wallet(org)
    existing = Order.objects.filter(idempotency_key=key).first()
    if existing:
        if existing.organization_id != org.pk or existing.created_by_id != actor.pk:
            raise ValidationError('Référence invalide.')
        return existing
    rows = cart_rows(cart, lock=True)
    if cart_fingerprint(rows) != fingerprint:
        raise ValidationError('Les prix ont changé. Vérifiez à nouveau votre panier.')
    total, credits, shipping = cart_totals(rows)
    if credits > wallet.balance:
        raise ValidationError('Solde insuffisant. Aucun crédit n’a été débité.')
    order = Order.objects.create(organization=org, created_by=actor, total_cents=total, credits_cents=credits,
        shipping_cents=shipping, shipping_address=address, idempotency_key=key)
    OrderStatusHistory.objects.create(order=order, actor=actor, status='PENDING', reason='Commande confirmée par le client')
    for r in rows:
        p = r['product']
        OrderItem.objects.create(order=order, product=p, name=p.name, sku=p.sku, quantity=r['quantity'],
            price_cents=p.price_cents, credits_cents=p.credits_cents, tax_percent=p.tax_percent, stock_decremented=r['stock_decremented'])
        if r['stock_decremented']:
            p.stock_quantity -= r['quantity']
            p.save(update_fields=['stock_quantity', 'updated_at'])
            event(actor, 'product.stock_debit', p, quantity=r['quantity'], order=str(order.pk))
    order.debit = post_entry(wallet, actor, -credits, 'PURCHASE', 'order:' + str(order.pk), 'order', order.pk, 'Commande ' + order.reference)
    order.save(update_fields=['debit'])
    order_status(order, actor, 'PAID', 'Paiement en Crédits YVEXOR validé')
    notify_team('Nouvelle commande ' + order.reference, reverse('shop-order', args=[order.pk]))
    return order


@transaction.atomic
def transition_order(pk, actor, status, reason, restock=False):
    initial = Order.objects.get(pk=pk)
    wallet = locked_wallet(initial.organization)
    order = Order.objects.select_for_update().get(pk=pk)
    if not reason.strip():
        raise ValidationError('Indiquez un motif ou une information de suivi.')
    if status == order.status:
        return order
    allowed = {'PAID': {'PREPARING','REFUNDED'}, 'PREPARING': {'READY_FOR_PICKUP','SHIPPED','REFUNDED'},
        'READY_FOR_PICKUP': {'DELIVERED','SHIPPED','REFUNDED'}, 'SHIPPED': {'DELIVERED','REFUNDED'},
        'DELIVERED': {'REFUNDED'}, 'PENDING': {'CANCELLED'}}
    if status not in allowed.get(order.status, set()):
        raise ValidationError('Changement d’état interdit. Une commande payée doit être remboursée pour être annulée.')
    if status == 'REFUNDED':
        if not order.debit_id:
            raise ValidationError('Aucun débit à rembourser.')
        post_entry(wallet, actor, order.credits_cents, 'REFUND', 'refund:order:' + str(order.pk), 'order', order.pk, reason, order.debit)
        if restock:
            for item in order.items.select_related('product').order_by('product_id'):
                p = Product.objects.select_for_update().get(pk=item.product_id)
                if item.stock_decremented and p.stock_tracking_enabled:
                    p.stock_quantity += item.quantity
                    p.save(update_fields=['stock_quantity','updated_at'])
                    event(actor, 'product.stock_return', p, quantity=item.quantity, order=str(order.pk))
    order_status(order, actor, status, reason)
    notify_client(order.organization, 'Commande : ' + order.get_status_display(), reverse('shop-order', args=[order.pk]))
    return order


def payment_status(payment, actor, status, reason):
    payment.status = status
    payment.save()
    PaymentStatusHistory.objects.create(payment=payment, actor=actor, status=status, reason=reason)
    event(actor, 'payment.' + status.lower(), payment, reason=reason)


@transaction.atomic
def send_payment(pk, actor):
    p = PaymentRequest.objects.select_for_update().get(pk=pk)
    if p.status != 'DRAFT':
        raise ValidationError('Cette demande a déjà été envoyée.')
    if p.expires_at and p.expires_at <= timezone.now():
        raise ValidationError('La date d’expiration est passée.')
    p.sent_at = timezone.now()
    p.message = DirectMessage.objects.create(organization=p.organization, author=actor, from_team=True,
        body='Demande de paiement YVEXOR : ' + p.title)
    payment_status(p, actor, 'SENT', 'Demande envoyée au client')
    notify_client(p.organization, 'Demande de paiement : ' + p.title, reverse('shop-payment', args=[p.pk]))
    return p


@transaction.atomic
def pay_request(org, actor, pk):
    wallet = locked_wallet(org)
    p = PaymentRequest.objects.select_for_update().get(pk=pk, organization=org)
    if p.status == 'PAID':
        return p
    if p.status not in ('SENT','VIEWED') or (p.expires_at and p.expires_at <= timezone.now()):
        raise ValidationError('Cette demande n’est plus payable.')
    p.debit = post_entry(wallet, actor, -p.credits_cents, 'SERVICE', 'payment:' + str(p.pk), 'payment', p.pk, p.title)
    p.paid_at = timezone.now()
    payment_status(p, actor, 'PAID', 'Paiement en Crédits YVEXOR validé')
    notify_team('Paiement reçu : ' + p.title, reverse('shop-payment', args=[p.pk]))
    return p


@transaction.atomic
def refund_service(org, actor, entry_id, reason):
    wallet = locked_wallet(org)
    entry = WalletTransaction.objects.get(pk=entry_id, wallet=wallet, type='SERVICE')
    return post_entry(wallet, actor, -entry.amount_cents, 'REFUND', 'refund:service:' + str(entry.pk),
        'payment', entry.reference_id, reason, entry)
