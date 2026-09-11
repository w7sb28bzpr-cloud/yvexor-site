from django import forms
from django.forms import inlineformset_factory
from django.utils import timezone
from .models import Quote, QuoteItem, Solution


class QuoteForm(forms.ModelForm):
    class Meta:
        model = Quote
        fields = ['title','issuer_name','issuer_details','client_details','currency','valid_until','conditions']
        labels = {'title':'Objet du devis','issuer_name':'Entité YVEXOR émettrice',
            'issuer_details':'Adresse, identifiants légaux et mentions de l’émetteur',
            'client_details':'Destinataire : raison sociale, adresse et contact',
            'currency':'Devise','valid_until':'Valable jusqu’au','conditions':'Conditions, acompte et échéancier éventuels'}
        widgets = {'valid_until':forms.DateInput(attrs={'type':'date'},format='%Y-%m-%d'),
                   'issuer_details':forms.Textarea(attrs={'rows':3}),
                   'client_details':forms.Textarea(attrs={'rows':3}), 'conditions':forms.Textarea(attrs={'rows':4})}

    def clean_valid_until(self):
        value = self.cleaned_data['valid_until']
        if value < timezone.localdate():
            raise forms.ValidationError('La validité ne peut pas être dans le passé.')
        return value


class QuoteItemForm(forms.ModelForm):
    class Meta:
        model = QuoteItem
        fields = ['label','quantity','unit_price','tax_rate','discount']
        labels = {'label':'Prestation','quantity':'Quantité','unit_price':'Prix unitaire HT','tax_rate':'TVA (%)','discount':'Remise (%)'}


ItemsFormSet = inlineformset_factory(Quote, QuoteItem, form=QuoteItemForm, extra=1,
    can_delete=True, min_num=1, validate_min=True, max_num=30, validate_max=True, absolute_max=30)


class SolutionForm(forms.ModelForm):
    class Meta:
        model = Solution
        fields = ['name','description','url','active']
        labels = {'name':'Nom de la solution','description':'Présentation','url':'Adresse HTTPS de la solution','active':'Solution active'}

    def clean_url(self):
        value = self.cleaned_data['url']
        if not value.startswith('https://'):
            raise forms.ValidationError('Une adresse HTTPS est obligatoire.')
        return value
