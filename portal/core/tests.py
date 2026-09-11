import hashlib
from datetime import timedelta
from unittest.mock import patch
from django.conf import settings
from django.contrib.auth import SESSION_KEY
from django.test import TestCase, Client, override_settings
from django.urls import reverse
from django.utils import timezone
from django_otp.plugins.otp_totp.models import TOTPDevice
from .models import User, Organization, Membership, Request, Project, Message, OwnerInvite


@override_settings(SECURE_SSL_REDIRECT=False, SESSION_COOKIE_SECURE=False, CSRF_COOKIE_SECURE=False,
                   OWNER_EMAIL='owner@example.com', PASSWORD_HASHERS=['django.contrib.auth.hashers.MD5PasswordHasher'])
class PortalTests(TestCase):
    def setUp(self):
        self.a = User.objects.create_user('a', email='a@example.com', password='secure-long-password', first_name='Alice')
        self.b = User.objects.create_user('b', email='b@example.com', password='secure-long-password')
        self.owner = User.objects.create_user('owner', email='owner@example.com', password='secure-long-password', is_staff=True, is_superuser=True)
        self.org_a = Organization.objects.create(name='Projet Alice')
        self.org_b = Organization.objects.create(name='Projet Bob')
        Membership.objects.create(user=self.a, organization=self.org_a)
        Membership.objects.create(user=self.b, organization=self.org_b)
        self.item = Request.objects.create(organization=self.org_a, author=self.a, title='Site Alice', body='Mon idée privée')
        self.project = Project.objects.create(organization=self.org_a, source=self.item, name='Projet privé', description='Description')

    def owner_login(self):
        self.client.force_login(self.owner)
        device = TOTPDevice.objects.create(user=self.owner, confirmed=True)
        session = self.client.session
        session['otp_device_id'] = device.persistent_id
        session.save()

    def test_anonymous_protected(self):
        for route in ['/client/', '/admin/', '/requests/', '/projects/', '/account/']:
            self.assertEqual(self.client.get(route).status_code, 302)

    def test_tenant_cannot_read_or_write_another_request(self):
        self.client.force_login(self.b)
        url = reverse('request-detail', args=[self.item.pk])
        self.assertEqual(self.client.get(url).status_code, 404)
        self.assertEqual(self.client.post(url, {'body': 'Injection'}).status_code, 404)
        self.assertFalse(Message.objects.exists())
        self.assertNotContains(self.client.get('/requests/'), 'Site Alice')

    def test_tenant_cannot_read_or_edit_another_project(self):
        self.client.force_login(self.b)
        url = reverse('project-detail', args=[self.project.pk])
        self.assertEqual(self.client.get(url).status_code, 404)
        self.assertEqual(self.client.post(url, {'progress': 100}).status_code, 404)

    def test_client_cannot_access_admin_or_convert(self):
        self.client.force_login(self.a)
        for route in ['/admin/', '/admin/clients/']:
            self.assertEqual(self.client.get(route).status_code, 403)
        self.assertEqual(self.client.post(reverse('convert', args=[self.item.pk])).status_code, 403)

    def test_admin_password_alone_not_sufficient(self):
        self.client.force_login(self.owner)
        for route in ['/admin/', '/admin/clients/', '/requests/', reverse('request-detail', args=[self.item.pk])]:
            self.assertRedirects(self.client.get(route), '/auth/mfa/', fetch_redirect_response=False)

    def test_mfa_owner_can_read_and_reply(self):
        self.owner_login()
        self.assertContains(self.client.get('/admin/'), 'Site Alice')
        self.client.post(reverse('request-detail', args=[self.item.pk]), {'body': 'Réponse réelle'})
        self.assertTrue(Message.objects.get().from_team)
        self.client.force_login(self.a)
        self.assertContains(self.client.get(reverse('request-detail', args=[self.item.pk])), 'Réponse réelle')
        self.assertIsNotNone(Message.objects.get().read_at)

    def test_conversion_is_idempotent(self):
        self.owner_login()
        route = reverse('convert', args=[self.item.pk])
        self.client.post(route)
        self.client.post(route)
        self.assertEqual(Project.objects.filter(source=self.item).count(), 1)

    def test_project_update_validates_progress(self):
        self.owner_login()
        self.client.post(reverse('project-detail', args=[self.project.pk]), {'name':'Projet', 'description':'Texte', 'status':'tests', 'progress':150})
        self.project.refresh_from_db()
        self.assertEqual(self.project.progress, 0)

    def test_persistent_login_and_logout(self):
        response = self.client.post('/auth/login/', {'email':'a@example.com', 'password':'secure-long-password', 'remember':'on'})
        self.assertEqual(response.status_code, 302)
        self.assertEqual(int(response.cookies[settings.SESSION_COOKIE_NAME]['max-age']), 90*86400)
        stolen = self.client.cookies[settings.SESSION_COOKIE_NAME].value
        self.client.post('/auth/logout/')
        replay = Client()
        replay.cookies[settings.SESSION_COOKIE_NAME] = stolen
        self.assertEqual(replay.get('/client/').status_code, 302)

    def test_csrf_required(self):
        secure_client = Client(enforce_csrf_checks=True)
        secure_client.force_login(self.a)
        self.assertEqual(secure_client.post(reverse('request-detail', args=[self.item.pk]), {'body':'CSRF'}).status_code, 403)

    def test_xss_is_escaped(self):
        self.item.body = '<script>alert(1)</script>'
        self.item.save()
        self.client.force_login(self.a)
        response = self.client.get(reverse('request-detail', args=[self.item.pk]))
        self.assertNotContains(response, '<script>alert(1)</script>')
        self.assertContains(response, '&lt;script&gt;')
        self.assertIn('no-store', response['Cache-Control'])

    def test_signup_cannot_claim_owner_or_existing_organization(self):
        payload = {'first_name':'New', 'last_name':'Client','email':'new@example.com','phone':'0612345678',
                   'company':'Projet Alice','password1':'UniquePassForNew2026!', 'password2':'UniquePassForNew2026!'}
        self.assertEqual(self.client.post('/auth/signup/', payload).status_code, 302)
        user = User.objects.get(email='new@example.com')
        self.assertFalse(user.is_staff)
        self.assertNotEqual(Membership.objects.get(user=user).organization_id, self.org_a.pk)
        self.client.logout()
        payload['email'] = 'OWNER@example.com'
        self.assertEqual(self.client.post('/auth/signup/', payload).status_code, 200)
        self.assertEqual(User.objects.filter(is_superuser=True).count(), 1)

    def test_rate_limit(self):
        for _ in range(11):
            response = self.client.post('/auth/login/', {'email':'a@example.com','password':'wrong'})
        self.assertContains(response, 'Trop de tentatives')

    def test_pages_render(self):
        self.client.force_login(self.a)
        for route in ['/client/','/requests/','/requests/new/','/projects/','/messages/','/account/',reverse('project-detail',args=[self.project.pk])]:
            self.assertEqual(self.client.get(route).status_code, 200, route)
        self.owner_login()
        for route in ['/admin/','/admin/clients/',reverse('client-detail',args=[self.org_a.pk])]:
            self.assertEqual(self.client.get(route).status_code, 200, route)

    def test_manifest_and_worker(self):
        self.assertEqual(self.client.get('/manifest-admin.webmanifest').json()['start_url'], '/admin/')
        self.assertContains(self.client.get('/sw.js'), 'Never cache private')

    def test_invalid_owner_invite(self):
        response = self.client.post('/auth/activate/', {'code':'invalid', 'password':'StrongExamplePass24!', 'confirmation':'StrongExamplePass24!'})
        self.assertContains(response, 'Code invalide')

    def test_expired_owner_invite(self):
        OwnerInvite.objects.create(email='owner@example.com', digest=hashlib.sha256(b'expired').hexdigest(), expires_at=timezone.now()-timedelta(seconds=1))
        response = self.client.post('/auth/activate/', {'code':'expired','password':'StrongExamplePass24!', 'confirmation':'StrongExamplePass24!'})
        self.assertContains(response, 'Code invalide')

    def test_owner_invite_is_single_use_and_requires_mfa(self):
        self.owner.delete()
        invite = OwnerInvite.objects.create(email='owner@example.com', digest=hashlib.sha256(b'one-use').hexdigest(), expires_at=timezone.now()+timedelta(hours=1))
        data = {'code':'one-use','password':'StrongExamplePass24!', 'confirmation':'StrongExamplePass24!'}
        self.assertRedirects(self.client.post('/auth/activate/', data), '/auth/mfa/', fetch_redirect_response=False)
        invite.refresh_from_db()
        self.assertIsNotNone(invite.used_at)
        self.assertRedirects(self.client.get('/admin/'), '/auth/mfa/', fetch_redirect_response=False)
        self.client.logout()
        self.assertContains(self.client.post('/auth/activate/', data), 'Code invalide')

    def test_mfa_enrollment_and_code_replay(self):
        from django_otp.oath import totp
        self.client.force_login(self.owner)
        self.assertContains(self.client.get('/auth/mfa/'), 'Sécurisez votre compte')
        self.assertEqual(self.client.get('/auth/mfa/qr/').status_code, 200)
        device = TOTPDevice.objects.get(user=self.owner)
        code = str(totp(device.bin_key)).zfill(6)
        self.assertRedirects(self.client.post('/auth/mfa/', {'code':code}), '/admin/', fetch_redirect_response=False)
        self.assertEqual(self.client.get('/admin/').status_code, 200)
        self.assertEqual(self.client.get('/auth/mfa/qr/').status_code, 404)
        self.client.logout()
        self.client.force_login(self.owner)
        self.assertContains(self.client.post('/auth/mfa/', {'code':code}), 'Code incorrect')

    def test_password_change_revokes_other_device(self):
        self.client.force_login(self.a)
        other = Client()
        other.force_login(self.a)
        response = self.client.post('/account/', {'old_password':'secure-long-password',
            'new_password1':'DifferentStrongPassword!34', 'new_password2':'DifferentStrongPassword!34'})
        self.assertEqual(response.status_code, 302)
        self.assertEqual(self.client.get('/client/').status_code, 200)
        self.assertEqual(other.get('/client/').status_code, 302)

    @override_settings(SESSION_COOKIE_SECURE=True)
    def test_secure_cookie_flags(self):
        response = self.client.post('/auth/login/', {'email':'a@example.com','password':'secure-long-password','remember':'on'})
        cookie = response.cookies[settings.SESSION_COOKIE_NAME]
        self.assertTrue(cookie['secure'])
        self.assertTrue(cookie['httponly'])
        self.assertEqual(cookie['samesite'], 'Lax')
