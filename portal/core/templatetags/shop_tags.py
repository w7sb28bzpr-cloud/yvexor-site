from decimal import Decimal
from django import template

register = template.Library()


@register.filter
def units(value):
    return f'{Decimal(value or 0) / 100:,.2f}'.replace(',', '\u202f').replace('.', ',')
