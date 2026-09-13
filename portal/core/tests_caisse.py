from django.test import TestCase, override_settings
from .caisse import normalize, draft_initial
from .models import User, Organization, Membership, Request

@override_settings(SECURE_SSL_REDIRECT=False, SESSION_COOKIE_SECURE=False, CSRF_COOKIE_SECURE=False,
                   PASSWORD_HASHERS=['django.contrib.auth.hashers.MD5PasswordHasher'])
class CaisseTests(TestCase):
    def selection(self, **values):
        return {'profession':'alimentation', 'plan':'stock', 'hardware':'own', **values}

    def test_four_commercial_examples(self):
        cases=[({},79,0),({'profession':'boulangerie','plan':'pilotage','website':'true','hardware':'post'},158,380),
               ({'profession':'snack','plan':'pilotage','website':'true','mobile':'true'},187,0),
               ({'profession':'snack','kiosk':'1','hardware':'post'},98,380)]
        for values,monthly,hardware in cases:
            text=draft_initial(normalize(self.selection(**values)))['body']
            self.assertIn(f'Total mensuel : {monthly} € HT/mois',text)
            self.assertIn(f'{hardware} € HT, achat unique',text)

    def test_no_client_price_and_no_implicit_license_price(self):
        text=draft_initial(normalize(self.selection(price='1',license='true',tpe='true')))['body']
        self.assertIn('Total mensuel : sur devis',text)
        self.assertIn('TPE / paiement CB demandé',text)
        self.assertNotIn('1 € HT',text)

    def test_wrong_family_and_counts_rejected(self):
        for values in [{'profession':'restaurant'},{'profession':'coiffure'},{'kiosk':'-1'},{'kitchen':'999'},{'kiosk':'NaN'}]:
            self.assertEqual(self.client.get('/caisse/preparer/',self.selection(**values)).status_code,400)
        s=normalize(self.selection(kiosk='2',mobile='true'))
        self.assertEqual(s['kiosk'],0);self.assertFalse(s['mobile'])

    def test_draft_survives_login_then_sends_to_existing_request_system(self):
        user=User.objects.create_user('caisse-test',email='test@example.com',password='test-long-password')
        org=Organization.objects.create(name='Caisse test');Membership.objects.create(user=user,organization=org)
        response=self.client.get('/caisse/preparer/',self.selection())
        self.assertEqual(response.url,'/auth/login/')
        self.assertEqual(Request.objects.count(),0)
        response=self.client.post('/auth/login/',{'email':'test@example.com','password':'test-long-password','remember':'on'})
        self.assertEqual(response.url,'/requests/new/')
        response=self.client.get(response.url)
        self.assertContains(response,'79 € HT/mois')
        initial=draft_initial(self.client.session['caisse_draft'])
        response=self.client.post('/requests/new/',{**initial,'budget':'unknown','timeline':'unknown','details':''})
        self.assertEqual(response.status_code,302)
        item=Request.objects.get();self.assertEqual(item.organization,org)
        self.assertIn('Total mensuel : 79 € HT/mois',item.body)
        self.assertNotIn('caisse_draft',self.client.session)
