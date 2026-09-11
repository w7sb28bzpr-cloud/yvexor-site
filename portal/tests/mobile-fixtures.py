"""Synthetic browser-test data, permitted only in the local SQLite preview."""
import json
import uuid
from django.conf import settings
from django.contrib.sessions.backends.db import SessionStore
from django.contrib.auth import SESSION_KEY, BACKEND_SESSION_KEY, HASH_SESSION_KEY
from django_otp.plugins.otp_totp.models import TOTPDevice
from core.models import User, Organization, Membership, Request, Project

assert settings.DEBUG and settings.DATABASES['default']['ENGINE'].endswith('sqlite3'), 'Local tests only'
tag = uuid.uuid4().hex[:10]
customer = User.objects.create_user('mobile-'+tag, email='mobile-'+tag+'@example.invalid', first_name='Camille',
    last_name='Test local', password='LocalPreviewOnly!2026')
owner = User.objects.create_user('mobile-team-'+tag, email='mobile-team-'+tag+'@example.invalid', first_name='Yannick',
    is_staff=True, is_superuser=True, password='LocalPreviewOnly!2026')
org = Organization.objects.create(name='Audit mobile local')
Membership.objects.create(user=customer, organization=org)
item = Request.objects.create(organization=org, author=customer, title='Projet de test local', body='Données fictives.')
project = Project.objects.create(organization=org, source=item, name='Projet de test local', description='Données fictives.', status='development', progress=65)

def session(user):
    store = SessionStore()
    store[SESSION_KEY] = str(user.pk)
    store[BACKEND_SESSION_KEY] = 'django.contrib.auth.backends.ModelBackend'
    store[HASH_SESSION_KEY] = user.get_session_auth_hash()
    if user.is_staff:
        device = TOTPDevice.objects.create(user=user, confirmed=True)
        store['otp_device_id'] = device.persistent_id
    store.save()
    return store.session_key

print(json.dumps({'org':str(org.pk), 'project':str(project.pk), 'request':str(item.pk),
    'client':session(customer), 'admin':session(owner), 'cookie':settings.SESSION_COOKIE_NAME}))
