"""Commercial draft only. No entitlement, subscription, stock or payment mutation."""
import json
from pathlib import Path
from django.http import HttpResponseBadRequest
from django.shortcuts import redirect
from django.views.decorators.http import require_GET

CATALOGUE = json.loads(Path(__file__).with_name('caisse_catalogue.json').read_text(encoding='utf-8'))

def normalize(raw):
    professions = {p['slug']: p for p in CATALOGUE['professions']}
    if raw.get('profession') not in professions:
        raise ValueError('Choisissez une activité reconnue.')
    p = professions[raw['profession']]
    plans = {x['id']: x for x in CATALOGUE['plans'] if p['family'] in x['families']}
    plan = plans.get(raw.get('plan'))
    if p['family'] != 'other' and not plan:
        raise ValueError('Cette formule ne correspond pas à votre activité.')
    hardware = next((h for h in CATALOGUE['hardware'] if h['id'] == raw.get('hardware')), None)
    if not hardware:
        raise ValueError('Choisissez un équipement reconnu.')
    result = {'profession': p['slug'], 'plan': plan['id'] if plan else '', 'hardware': hardware['id']}
    for name in ('website', 'mobile', 'tpe', 'license'):
        result[name] = raw.get(name) == 'true'
    for name in ('kiosk', 'kitchen'):
        try:
            result[name] = int(raw.get(name, '0'))
        except (ValueError, TypeError):
            raise ValueError('Quantité invalide.')
        if not 0 <= result[name] <= 20:
            raise ValueError('La quantité doit être comprise entre 0 et 20.')
    if p['family'] != 'snack':
        result.update(mobile=False, kiosk=0, kitchen=0)
    if p['family'] == 'other':
        result['website'] = False
    return result

def draft_initial(draft):
    if not draft:
        return {}
    # Revalidate stored values, never accept a submitted price as authoritative.
    try:
        s = normalize({k: str(v).lower() for k, v in draft.items()})
    except (ValueError, AttributeError):
        return {}
    p = next(p for p in CATALOGUE['professions'] if p['slug'] == s['profession'])
    plan = next((x for x in CATALOGUE['plans'] if x['id'] == s['plan']), None)
    hardware = next(x for x in CATALOGUE['hardware'] if x['id'] == s['hardware'])
    lines = ['Configuration YVEXOR Caisses — estimation HT, sans engagement', 'Activité : ' + p['name']]
    monthly = plan['monthly'] if plan else 0
    if plan:
        lines.append('Formule : ' + plan['name'] + (' — licence sur devis' if s['license'] else f" — {monthly} € HT/mois"))
    for option in CATALOGUE['options']:
        quantity = int(s.get(option['id'], 0))
        if quantity and p['family'] in option['families']:
            amount = option['monthly'] * quantity
            monthly += amount
            lines.append(f"{option['name']} × {quantity} : {amount} € HT/mois — {option['availability']}")
    lines.append('Total mensuel : ' + ('sur devis' if s['license'] or not plan else f'{monthly} € HT/mois'))
    lines.append(f"Matériel : {hardware['name']} — {hardware['once']} € HT, achat unique")
    if s['tpe']:
        lines.append('TPE / paiement CB demandé : frais et commissions sur proposition, non inclus.')
    if s['license']:
        lines.append('Achat du logiciel sans abonnement demandé : licence et services à chiffrer séparément.')
    lines.append(CATALOGUE['disclaimer'])
    return {'category': 'pos', 'title': 'Ma caisse — ' + p['name'], 'body': '\n'.join(lines)}

@require_GET
def prepare(request):
    # Only stage a draft. The authenticated, CSRF-protected request form performs the send.
    if len(request.META.get('QUERY_STRING', '')) > 2000:
        return HttpResponseBadRequest('Configuration trop longue.')
    try:
        draft = normalize(request.GET)
    except ValueError as error:
        return HttpResponseBadRequest(str(error))
    request.session['caisse_draft'] = draft
    if request.user.is_authenticated:
        return redirect('request-new')
    request.session['shop_next'] = '/requests/new/'
    return redirect('login')
