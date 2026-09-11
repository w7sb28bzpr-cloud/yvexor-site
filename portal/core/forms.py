from django import forms
from django.conf import settings
from django.contrib.auth.forms import UserCreationForm
from .models import User, Request, Project


class SignupForm(UserCreationForm):
    first_name = forms.CharField(label='Prénom', max_length=150)
    last_name = forms.CharField(label='Nom', max_length=150)
    email = forms.EmailField(label='Adresse e-mail')
    phone = forms.CharField(label='Téléphone', max_length=32)
    company = forms.CharField(label='Nom du groupe ou du projet', max_length=160)

    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'email', 'phone', 'company']

    def clean_email(self):
        email = self.cleaned_data['email'].strip().lower()
        if email == settings.OWNER_EMAIL or User.objects.filter(email__iexact=email).exists():
            raise forms.ValidationError('Cette adresse ne peut pas être utilisée pour cette inscription. Essayez de vous connecter.')
        return email


class RequestForm(forms.ModelForm):
    class Meta:
        model = Request
        fields = ['title', 'body', 'details']
        labels = {'title': 'Un titre pour votre idée', 'body': 'Quel est votre besoin ?', 'details': 'Précisions : délais, contexte, budget souhaité (facultatif)'}
        widgets = {'body': forms.Textarea(attrs={'rows': 7, 'placeholder': 'Je voudrais créer un site, améliorer mon application…'}), 'details': forms.Textarea(attrs={'rows': 3})}


class MessageForm(forms.Form):
    body = forms.CharField(label='Votre message', max_length=10000, widget=forms.Textarea(attrs={'rows': 4}))


class ProjectForm(forms.ModelForm):
    class Meta:
        model = Project
        fields = ['name', 'description', 'status', 'progress']
        labels = {'name': 'Nom du projet', 'description': 'Description visible par le client', 'status': 'Étape', 'progress': 'Progression (%)'}


class LoginForm(forms.Form):
    email = forms.EmailField(label='Adresse e-mail', widget=forms.EmailInput(attrs={'autocomplete': 'username'}))
    password = forms.CharField(label='Mot de passe', widget=forms.PasswordInput(attrs={'autocomplete': 'current-password'}))
    remember = forms.BooleanField(label='Rester connecté sur cet appareil pendant 90 jours', required=False, initial=True)
