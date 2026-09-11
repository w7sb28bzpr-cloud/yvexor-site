from decimal import Decimal, ROUND_HALF_UP
from django.db.models import Q
from .models import User, Notification


def money(amount):
    return amount.quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)


def quote_snapshot(quote):
    rows = []
    net = Decimal(0)
    tax = Decimal(0)
    for item in quote.items.all():
        subtotal = money(item.quantity * item.unit_price * (Decimal(1) - item.discount / 100))
        tax_amount = money(subtotal * item.tax_rate / 100)
        rows.append({'label': item.label, 'quantity': str(item.quantity), 'unit_price': str(item.unit_price),
            'tax_rate':str(item.tax_rate), 'discount':str(item.discount), 'subtotal':str(subtotal), 'tax':str(tax_amount)})
        net += subtotal
        tax += tax_amount
    return {'reference':quote.reference,'title':quote.title,'issuer_name':quote.issuer_name,
        'issuer_details':quote.issuer_details,'client_details':quote.client_details,
        'currency':quote.currency,'valid_until':quote.valid_until.isoformat(),'conditions':quote.conditions,
        'items':rows,'net':str(money(net)),'tax':str(money(tax)),'total':str(money(net+tax))}


def notify_team(title, path, exclude=None):
    recipients = User.objects.filter(is_active=True, is_staff=True, is_superuser=True).exclude(pk=exclude)
    Notification.objects.bulk_create([Notification(user=user,title=title[:200],path=path) for user in recipients])


def notify_client(organization, title, path, exclude=None):
    recipients = User.objects.filter(is_active=True, membership__organization=organization).exclude(pk=exclude).distinct()
    Notification.objects.bulk_create([Notification(user=user,title=title[:200],path=path) for user in recipients])
