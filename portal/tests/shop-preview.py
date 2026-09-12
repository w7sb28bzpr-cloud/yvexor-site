"""Isolated local visual fixtures. Never runs against PostgreSQL or production."""
import json
import os
import sys
import time
from pathlib import Path

root=Path(__file__).resolve().parents[1]
sys.path.insert(0,str(root))
os.environ['DJANGO_SETTINGS_MODULE']='config.settings'
os.environ['PORTAL_DEBUG']='1'
os.environ['PORTAL_SECRET_KEY']='isolated-local-shop-preview-not-production'
os.environ.pop('PORTAL_DB_NAME',None)
import django
from django.conf import settings
settings.DATABASES={'default':{'ENGINE':'django.db.backends.sqlite3','NAME':root/'private'/'shop-preview.sqlite3'}}
settings.MEDIA_ROOT=root/'private'/'shop-preview-images'
django.setup()
from django.core.management import call_command
from django.test import Client
from django_otp.plugins.otp_totp.models import TOTPDevice
from core.models import User, Organization, Membership
call_command('migrate',verbosity=0)
admin,_=User.objects.get_or_create(username='shop-preview-admin',defaults={'email':'shop-admin@example.invalid','first_name':'Admin test','is_staff':True,'is_superuser':True})
client,_=User.objects.get_or_create(username='shop-preview-client',defaults={'email':'shop-client@example.invalid','first_name':'Client test'})
org,_=Organization.objects.get_or_create(name='Organisation de démonstration locale')
Membership.objects.get_or_create(user=client,organization=org)
call_command('import_first_product',image=str(root/'seed-assets'/'ecran-tactile-156.png'))
session_data={}
for name,user in [('admin',admin),('client',client)]:
    c=Client();c.force_login(user)
    if user.is_staff:
        device,_=TOTPDevice.objects.get_or_create(user=user,defaults={'confirmed':True})
        session=c.session;session['otp_device_id']=device.persistent_id;session['mfa_at']=time.time();session.save()
    session_data[name]=c.cookies[settings.SESSION_COOKIE_NAME].value
session_data['org']=str(org.pk)
(root/'private'/'shop-preview-sessions.json').write_text(json.dumps(session_data))
call_command('runserver','127.0.0.1:8182',use_reloader=False)
