import uuid
from decimal import Decimal
from django import forms
from django.utils import timezone
from .models import Product, Category, PaymentRequest, Project, Quote


def euro_field(label, required=True, minimum=Decimal('0.01')):
    return forms.DecimalField(label=label, required=required, max_digits=9, decimal_places=2,
        min_value=minimum, max_value=Decimal('1000000'), widget=forms.NumberInput(attrs={'step':'0.01','inputmode':'decimal'}))


class ProductForm(forms.ModelForm):
    revision = forms.CharField(required=False, widget=forms.HiddenInput)
    price = euro_field('Prix TTC en euros')
    credits = euro_field('Prix en crédits (vide = prix en euros)', required=False)
    shipping = euro_field('Livraison par unité en euros (0 = offerte)', minimum=Decimal(0))
    features_text = forms.CharField(label='Caractéristiques : une ligne « Nom : Valeur »', required=False, widget=forms.Textarea(attrs={'rows':5}))

    class Meta:
        model = Product
        fields = ['name','slug','sku','category','short_description','description','tax_percent',
            'stock_tracking_enabled','stock_quantity','low_stock_threshold','availability','preorder_enabled',
            'purchase_with_credits_enabled','featured']
        labels = {'name':'Nom','slug':'Adresse courte','sku':'Référence interne / SKU','category':'Catégorie',
            'short_description':'Présentation courte','description':'Description','tax_percent':'TVA (%)',
            'stock_tracking_enabled':'Suivre le stock','stock_quantity':'Stock disponible','low_stock_threshold':'Seuil d’alerte stock',
            'availability':'Disponibilité','preorder_enabled':'Autoriser explicitement les précommandes',
            'purchase_with_credits_enabled':'Autoriser l’achat en crédits','featured':'Mettre en avant sur l’accueil'}

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        if self.instance and not self.instance._state.adding:
            self.fields['revision'].initial = self.instance.updated_at.isoformat()
            for field, attr in [('price','price_cents'),('credits','credits_cents'),('shipping','shipping_cents')]:
                self.fields[field].initial = Decimal(getattr(self.instance, attr)) / 100
            self.fields['features_text'].initial = '\n'.join(f'{k} : {v}' for k,v in self.instance.features.items())
        self.fields['tax_percent'].min_value = 0
        self.fields['tax_percent'].max_value = 100

    def clean(self):
        data = super().clean()
        if not self.instance._state.adding and data.get('revision') != self.instance.updated_at.isoformat():
            self.add_error(None,'Cet article a changé (vente, stock ou modification). Rechargez la fiche avant de l’enregistrer.')
        if data.get('stock_tracking_enabled') and data.get('stock_quantity') is None:
            self.add_error('stock_quantity','Indiquez le stock ou désactivez son suivi.')
        if data.get('tax_percent') is not None and not 0 <= data['tax_percent'] <= 100:
            self.add_error('tax_percent','Taux invalide.')
        if data.get('availability') == 'PREORDER' and not data.get('preorder_enabled'):
            self.add_error('preorder_enabled','Autorisez les précommandes ou choisissez un autre statut.')
        features = {}
        for line in data.get('features_text','').splitlines():
            if not line.strip():
                continue
            if ':' not in line:
                self.add_error('features_text','Chaque ligne doit contenir Nom : Valeur.')
                break
            k,v = [p.strip() for p in line.split(':',1)]
            if not k or not v or len(k) > 80 or len(v) > 300 or len(features) >= 30:
                self.add_error('features_text','Maximum 30 caractéristiques, avec nom et valeur courts.')
                break
            features[k] = v
        self.instance.features = features
        if data.get('price'):
            self.instance.price_cents = int(data['price'] * 100)
            self.instance.credits_cents = int((data.get('credits') or data['price']) * 100)
        if data.get('shipping') is not None:
            self.instance.shipping_cents = int(data['shipping'] * 100)
        return data


class CategoryForm(forms.ModelForm):
    class Meta:
        model = Category
        fields = ['name','slug','position','active']
        labels = {'name':'Nom','slug':'Adresse courte','position':'Ordre','active':'Active'}


class AdjustmentForm(forms.Form):
    amount = euro_field('Crédits à ajouter ou retirer (négatif = retrait)', minimum=Decimal('-1000000'))
    reason = forms.CharField(label='Motif obligatoire', max_length=500, widget=forms.Textarea(attrs={'rows':3}))
    key = forms.UUIDField(initial=uuid.uuid4, widget=forms.HiddenInput)

    def clean_amount(self):
        if not self.cleaned_data['amount']:
            raise forms.ValidationError('Le montant ne peut pas être nul.')
        return self.cleaned_data['amount']


class CheckoutForm(forms.Form):
    address = forms.CharField(label='Nom du destinataire et adresse complète de livraison', max_length=1500, widget=forms.Textarea(attrs={'rows':4,'autocomplete':'street-address'}))
    confirm = forms.BooleanField(label='Je confirme le montant et le paiement en Crédits YVEXOR.')
    token = forms.CharField(widget=forms.HiddenInput)


class PaymentForm(forms.ModelForm):
    amount = euro_field('Montant total en euros (= crédits)')

    class Meta:
        model = PaymentRequest
        fields = ['title','description','project','quote','expires_at']
        labels = {'title':'Objet','description':'Description','project':'Projet lié','quote':'Devis lié','expires_at':'Expiration facultative'}
        widgets = {'expires_at':forms.DateTimeInput(attrs={'type':'datetime-local'}), 'description':forms.Textarea(attrs={'rows':4})}

    def __init__(self, *args, organization, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['project'].queryset = Project.objects.filter(organization=organization)
        self.fields['quote'].queryset = Quote.objects.filter(request__organization=organization)

    def clean_expires_at(self):
        value = self.cleaned_data.get('expires_at')
        if value and value <= timezone.now():
            raise forms.ValidationError('Choisissez une date future.')
        return value


class ImageUploadForm(forms.Form):
    photo = forms.FileField(label='Photo (JPEG, PNG ou WebP, 10 Mo maximum)')
    alt = forms.CharField(label='Description de la photo', max_length=240)
    position = forms.IntegerField(label='Ordre (0 = principale)', min_value=0, max_value=1000, initial=0)
