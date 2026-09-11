import tempfile
import time
from datetime import timedelta
from decimal import Decimal
from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import TestCase, override_settings
from django.urls import reverse
from django.utils import timezone
from django_otp.plugins.otp_totp.models import TOTPDevice
from .models import User, Organization, Membership, Request, Quote, QuoteItem, QuoteVersion, Attachment, Notification
from .services import quote_snapshot


@override_settings(SECURE_SSL_REDIRECT=False, SESSION_COOKIE_SECURE=False,
                   PASSWORD_HASHERS=['django.contrib.auth.hashers.MD5PasswordHasher'])
class CommerceTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user('client', email='client@example.invalid', email_verified=True)
        self.other = User.objects.create_user('other', email='other@example.invalid')
        self.owner = User.objects.create_user('owner', email='owner@example.invalid', is_staff=True, is_superuser=True)
        org = Organization.objects.create(name='Client test')
        Membership.objects.create(organization=org, user=self.user)
        self.request = Request.objects.create(organization=org, author=self.user, title='Projet test', body='Privé')
        self.quote = Quote.objects.create(request=self.request, title='Devis privé', issuer_name='Émetteur test',
            issuer_details='Données de test',client_details='Client test',currency='EUR',
            valid_until=timezone.localdate()+timedelta(days=10), conditions='Conditions de test')
        QuoteItem.objects.create(quote=self.quote,label='Prestation',quantity=Decimal('2'),unit_price=Decimal('19.99'),tax_rate=Decimal('20'),discount=Decimal('10'))

    def owner_login(self, fresh=True):
        self.client.force_login(self.owner)
        device = TOTPDevice.objects.create(user=self.owner, confirmed=True)
        session = self.client.session
        session['otp_device_id'] = device.persistent_id
        if fresh:
            session['mfa_at'] = time.time()
        session.save()

    def send_quote(self):
        self.owner_login()
        self.assertEqual(self.client.post(reverse('quote-send', args=[self.quote.pk]), {'confirm':'yes'}).status_code,302)
        return QuoteVersion.objects.get(quote=self.quote)

    def test_rounding_and_fixed_snapshot(self):
        self.assertEqual(quote_snapshot(self.quote)['total'],'43.18')
        version = self.send_quote()
        self.quote.items.update(unit_price=Decimal('100'))
        version.refresh_from_db()
        self.assertEqual(version.snapshot['total'],'43.18')

    def test_draft_hidden_and_cross_tenant_quote_hidden(self):
        self.client.force_login(self.user)
        self.assertEqual(self.client.get(reverse('quote-detail',args=[self.quote.pk])).status_code,404)
        version = self.send_quote()
        self.client.force_login(self.other)
        for route in [reverse('quote-detail',args=[self.quote.pk]),reverse('quote-document',args=[self.quote.pk,version.pk])]:
            self.assertEqual(self.client.get(route).status_code,404)

    def test_accept_once_and_no_edit_after_acceptance(self):
        version = self.send_quote()
        self.client.force_login(self.user)
        payload = {'decision':'accepted','confirm':'yes','version':str(version.pk)}
        route = reverse('quote-decide',args=[self.quote.pk])
        self.assertEqual(self.client.post(route,payload).status_code,302)
        self.assertEqual(self.client.post(route,payload).status_code,409)
        self.owner_login()
        self.assertEqual(self.client.get(reverse('quote-edit',args=[self.quote.pk])).status_code,409)

    def test_sensitive_send_requires_fresh_mfa(self):
        self.owner_login(fresh=False)
        self.assertRedirects(self.client.post(reverse('quote-send',args=[self.quote.pk]),{'confirm':'yes'}),'/auth/confirm/',fetch_redirect_response=False)
        self.assertFalse(QuoteVersion.objects.exists())

    def test_unverified_client_cannot_accept(self):
        version = self.send_quote()
        self.user.email_verified = False
        self.user.save()
        self.client.force_login(self.user)
        self.assertEqual(self.client.post(reverse('quote-decide',args=[self.quote.pk]),{'decision':'accepted','confirm':'yes','version':str(version.pk)}).status_code,403)

    def test_upload_download_isolation_and_rejected_html(self):
        with tempfile.TemporaryDirectory(prefix='yvexor-test-') as directory, override_settings(MEDIA_ROOT=directory):
            self.client.force_login(self.user)
            route = reverse('upload',args=[self.request.pk])
            self.client.post(route,{'file':SimpleUploadedFile('wrong.pdf',b'<script>alert(1)</script>')})
            self.assertFalse(Attachment.objects.exists())
            self.client.post(route,{'file':SimpleUploadedFile('note.txt',b'document prive')})
            attachment = Attachment.objects.get()
            download = reverse('download',args=[attachment.pk])
            response = self.client.get(download)
            self.assertEqual(b''.join(response.streaming_content),b'document prive')
            self.assertIn('attachment',response['Content-Disposition'])
            self.client.force_login(self.other)
            self.assertEqual(self.client.get(download).status_code,404)

    def test_notifications_and_notes_isolated(self):
        Notification.objects.create(user=self.user,title='Privé Alice',path='/client/')
        self.client.force_login(self.other)
        self.assertEqual(self.client.get('/api/summary/').json()['unread'],0)
        self.assertEqual(self.client.post(reverse('internal-note',args=[self.request.organization_id]),{'body':'Injection'}).status_code,403)

    def test_new_pages_render_for_both_roles(self):
        self.send_quote()
        for user in [self.user,self.owner]:
            if user == self.owner:
                self.owner_login()
            else:
                self.client.force_login(user)
            for route in ['/quotes/','/documents/','/solutions/','/notifications/',reverse('quote-detail',args=[self.quote.pk]),reverse('request-detail',args=[self.request.pk])]:
                self.assertEqual(self.client.get(route).status_code,200,route)
        self.assertEqual(self.client.get(reverse('quote-edit',args=[self.quote.pk])).status_code,200)
