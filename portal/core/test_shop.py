import io
import tempfile
import time
import uuid
from concurrent.futures import ThreadPoolExecutor
from datetime import timedelta
from unittest import skipUnless
from PIL import Image
from django.core import signing
from django.core.exceptions import ValidationError
from django.core.files.uploadedfile import SimpleUploadedFile
from django.db import connection, connections, transaction, DatabaseError
from django.test import TestCase, TransactionTestCase, override_settings
from django.urls import reverse
from django.utils import timezone
from django_otp.plugins.otp_totp.models import TOTPDevice
from .models import (User, Organization, Membership, Category, Product, ProductImage, Wallet,
    WalletTransaction, Order, OrderItem, ShopEvent, PaymentRequest, Project, Request, Quote)
from .shop_services import (adjust_wallet, checkout, cart_rows, cart_fingerprint, transition_order,
    pay_request, send_payment, refund_service)
from .shop_forms import ProductForm


def setup_data(obj):
    obj.user = User.objects.create_user('buyer',email='buyer@example.invalid')
    obj.other = User.objects.create_user('other',email='other@example.invalid')
    obj.admin = User.objects.create_user('owner',email='owner@example.invalid',is_staff=True,is_superuser=True)
    obj.org = Organization.objects.create(name='Shop test')
    obj.other_org = Organization.objects.create(name='Other test')
    Membership.objects.create(user=obj.user,organization=obj.org)
    Membership.objects.create(user=obj.other,organization=obj.other_org)
    obj.category = Category.objects.create(name='Écrans',slug='ecrans')
    obj.product = Product.objects.create(name='Test écran',slug='test-ecran',sku='TEST-1',category=obj.category,
        short_description='Test',price_cents=20000,credits_cents=20000,tax_percent='20.00',stock_quantity=10,
        availability='AVAILABLE',purchase_with_credits_enabled=True,status='PUBLISHED',published_at=timezone.now())
    obj.cart = {str(obj.product.pk):1}
    obj.fingerprint = cart_fingerprint(cart_rows(obj.cart))


@override_settings(SECURE_SSL_REDIRECT=False,SESSION_COOKIE_SECURE=False,
    PASSWORD_HASHERS=['django.contrib.auth.hashers.MD5PasswordHasher'])
class ShopTests(TestCase):
    def setUp(self):
        setup_data(self)

    def owner_login(self, fresh=True):
        self.client.force_login(self.admin)
        device = TOTPDevice.objects.create(user=self.admin,confirmed=True)
        session = self.client.session
        session['otp_device_id'] = device.persistent_id
        if fresh:
            session['mfa_at'] = time.time()
        session.save()

    def credit(self, amount=50000):
        return adjust_wallet(self.org,self.admin,amount,'Test crédit',uuid.uuid4())

    def buy(self, key=None):
        return checkout(self.org,self.user,self.cart,'Adresse test',key or uuid.uuid4(),self.fingerprint)

    def payment(self):
        p = PaymentRequest.objects.create(organization=self.org,created_by=self.admin,title='Acompte test',
            description='Test',amount_cents=20000,credits_cents=20000)
        send_payment(p.pk,self.admin)
        p.refresh_from_db()
        return p

    def test_exact_amount_balance_and_stock(self):
        self.credit()
        row = self.buy()
        self.assertEqual(row.credits_cents,20000)
        self.assertEqual(Wallet.objects.get(organization=self.org).balance,30000)
        self.product.refresh_from_db()
        self.assertEqual(self.product.stock_quantity,9)
        self.assertEqual(row.history.count(),2)

    def test_insufficient_balance_is_atomic(self):
        self.credit(10000)
        with self.assertRaises(ValidationError):
            self.buy()
        self.assertFalse(Order.objects.exists())
        self.product.refresh_from_db()
        self.assertEqual(self.product.stock_quantity,10)
        self.assertEqual(WalletTransaction.objects.count(),1)

    def test_double_click_has_one_debit(self):
        self.credit()
        key = uuid.uuid4()
        first = self.buy(key)
        self.assertEqual(first.pk,self.buy(key).pk)
        self.assertEqual(WalletTransaction.objects.filter(type='PURCHASE').count(),1)

    def test_price_change_invalidates_confirmation(self):
        self.credit()
        Product.objects.filter(pk=self.product.pk).update(credits_cents=25000)
        with self.assertRaises(ValidationError):
            self.buy()
        self.assertFalse(Order.objects.exists())

    def test_zero_stock_and_archived_not_purchasable(self):
        self.credit()
        for data in ({'stock_quantity':0},{'stock_quantity':10,'status':'ARCHIVED'}):
            Product.objects.filter(pk=self.product.pk).update(**data)
            with self.assertRaises(ValidationError):
                self.buy()

    def test_full_refund_once_and_original_preserved(self):
        self.credit()
        order = self.buy()
        debit = order.debit
        transition_order(order.pk,self.admin,'REFUNDED','Annulation test',True)
        transition_order(order.pk,self.admin,'REFUNDED','Même remboursement',True)
        debit.refresh_from_db()
        self.assertEqual(debit.amount_cents,-20000)
        self.assertEqual(debit.reversal.amount_cents,20000)
        self.assertEqual(Wallet.objects.get(organization=self.org).balance,50000)
        self.product.refresh_from_db()
        self.assertEqual(self.product.stock_quantity,10)
        self.assertEqual(WalletTransaction.objects.filter(type='REFUND').count(),1)

    def test_ledger_cannot_be_edited_or_deleted(self):
        entry = self.credit()
        with self.assertRaises(ValueError):
            entry.delete()
        with self.assertRaises(ValueError):
            WalletTransaction.objects.filter(pk=entry.pk).update(amount_cents=90000)
        entry.amount_cents=90000
        with self.assertRaises(ValueError):
            entry.save()

    def test_negative_adjustment_and_idempotency(self):
        key = uuid.uuid4()
        adjust_wallet(self.org,self.admin,10000,'Accord',key)
        adjust_wallet(self.org,self.admin,10000,'Accord',key)
        with self.assertRaises(ValidationError):
            adjust_wallet(self.org,self.admin,-10001,'Retrait',uuid.uuid4())
        self.assertEqual(Wallet.objects.get(organization=self.org).balance,10000)
        self.assertEqual(ShopEvent.objects.filter(action='wallet.adjustment').count(),1)

    def test_payment_double_pay_and_refund(self):
        self.credit()
        p = self.payment()
        pay_request(self.org,self.user,p.pk)
        pay_request(self.org,self.user,p.pk)
        self.assertEqual(Wallet.objects.get(organization=self.org).balance,30000)
        p.refresh_from_db()
        refund_service(self.org,self.admin,p.debit_id,'Remboursement test')
        refund_service(self.org,self.admin,p.debit_id,'Remboursement test')
        self.assertEqual(Wallet.objects.get(organization=self.org).balance,50000)

    def test_expired_payment_is_not_debited(self):
        self.credit()
        p = self.payment()
        p.expires_at = timezone.now()-timedelta(seconds=1)
        p.save()
        with self.assertRaises(ValidationError):
            pay_request(self.org,self.user,p.pk)
        self.assertEqual(Wallet.objects.get(organization=self.org).balance,50000)

    def test_tenant_isolation_all_private_routes(self):
        self.credit()
        order = self.buy()
        p = self.payment()
        self.client.force_login(self.other)
        for route in [reverse('shop-order',args=[order.pk]),reverse('shop-payment',args=[p.pk]),reverse('shop-entry',args=[order.debit.pk])]:
            self.assertEqual(self.client.get(route).status_code,404,route)
        self.assertEqual(self.client.post(reverse('shop-payment-pay',args=[p.pk]),{'confirm':'yes'}).status_code,404)
        self.assertEqual(self.client.post(reverse('shop-wallet-adjust',args=[self.org.pk]),{}).status_code,403)

    def test_client_cannot_see_draft_payment_in_wallet(self):
        PaymentRequest.objects.create(organization=self.org,created_by=self.admin,title='Hidden draft',description='secret',amount_cents=100,credits_cents=100)
        self.client.force_login(self.user)
        self.assertNotContains(self.client.get(reverse('shop-wallet')),'Hidden draft')

    def test_catalogue_publication_and_cors(self):
        Product.objects.filter(pk=self.product.pk).update(status='DRAFT')
        self.assertEqual(self.client.get('/api/catalogue/').json()['products'],[])
        self.owner_login()
        self.client.post(reverse('shop-product-action',args=[self.product.pk]),{'action':'publish'})
        self.assertEqual(len(self.client.get('/api/catalogue/').json()['products']),1)
        self.assertEqual(self.client.get('/api/catalogue/',HTTP_ORIGIN='https://yvexor.com')['Access-Control-Allow-Origin'],'https://yvexor.com')
        self.assertNotIn('Access-Control-Allow-Origin',self.client.get('/api/catalogue/',HTTP_ORIGIN='https://evil.invalid'))
        self.client.post(reverse('shop-product-action',args=[self.product.pk]),{'action':'unpublish'})
        self.assertEqual(self.client.get('/api/catalogue/').json()['products'],[])

    def test_admin_mfa_required(self):
        self.owner_login(fresh=False)
        response = self.client.post(reverse('shop-wallet-adjust',args=[self.org.pk]),{'amount':'100','reason':'test','key':uuid.uuid4()})
        self.assertEqual(response.status_code,302)
        self.assertIn('/auth/confirm/',response.url)
        self.assertFalse(WalletTransaction.objects.exists())

    def test_product_form_199_99_exact_and_duplicate_draft(self):
        data = {'name':'Écran','slug':'ecran','sku':'ECRAN','category':self.category.pk,'short_description':'Écran',
            'price':'199.99','credits':'','shipping':'0','tax_percent':'20','stock_tracking_enabled':'on','stock_quantity':'10',
            'low_stock_threshold':'2','availability':'AVAILABLE','purchase_with_credits_enabled':'on','features_text':'Taille : 15,6 pouces'}
        form = ProductForm(data)
        self.assertTrue(form.is_valid(),form.errors)
        p=form.save()
        self.assertEqual((p.price_cents,p.credits_cents),(19999,19999))
        self.assertEqual(p.status,'DRAFT')
        self.owner_login()
        self.client.post(reverse('shop-product-action',args=[p.pk]),{'action':'duplicate'})
        self.assertEqual(Product.objects.filter(name__contains='copie',status='DRAFT',stock_quantity=0).count(),1)

    def test_image_validation_visibility_and_admin_preview(self):
        with tempfile.TemporaryDirectory() as folder, override_settings(MEDIA_ROOT=folder):
            self.owner_login()
            self.client.post(reverse('shop-image-upload',args=[self.product.pk]),{'photo':SimpleUploadedFile('evil.png',b'<script>'), 'alt':'test','position':0})
            self.assertFalse(ProductImage.objects.exists())
            buf=io.BytesIO();Image.new('RGB',(10,10)).save(buf,'PNG')
            self.client.post(reverse('shop-image-upload',args=[self.product.pk]),{'photo':SimpleUploadedFile('ok.png',buf.getvalue()),'alt':'Photo test','position':0})
            image=ProductImage.objects.get()
            self.assertEqual(self.client.get(reverse('shop-image',args=[image.pk])).status_code,200)
            Product.objects.filter(pk=self.product.pk).update(status='DRAFT')
            self.assertEqual(self.client.get(reverse('shop-product-preview',args=[self.product.pk])).status_code,200)
            self.client.logout()
            self.assertEqual(self.client.get(reverse('shop-image',args=[image.pk])).status_code,404)

    def test_client_pages_and_checkout_confirmation(self):
        self.credit()
        self.client.force_login(self.user)
        for route in ('shop-catalogue','shop-wallet','shop-orders','shop-payments','shop-topup','shop-cart'):
            self.assertEqual(self.client.get(reverse(route)).status_code,200,route)
        self.client.post(reverse('shop-cart-add',args=[self.product.pk]),{'quantity':1})
        response=self.client.get(reverse('shop-cart'))
        token=response.context['form'].initial['token']
        payload={'address':'Adresse test','confirm':'on','token':token}
        self.assertEqual(self.client.post(reverse('shop-cart'),payload).status_code,302)
        self.assertEqual(self.client.post(reverse('shop-cart'),payload).status_code,302)
        self.assertEqual(Order.objects.count(),1)

    def test_login_return_does_not_allow_external_redirect(self):
        self.client.get('/auth/login/?next=//evil.invalid/')
        self.assertNotIn('shop_next',self.client.session)
        self.client.get('/auth/login/?next=/catalogue/test-ecran/')
        self.assertEqual(self.client.session['shop_next'],'/catalogue/test-ecran/')

    def test_stale_admin_form_cannot_restore_sold_stock(self):
        revision=self.product.updated_at.isoformat()
        self.credit();self.buy();self.product.refresh_from_db()
        form=ProductForm({'revision':revision},instance=self.product)
        self.assertFalse(form.is_valid())
        self.assertIn('Cet article a changé',str(form.non_field_errors()))

    def test_admin_pages_and_private_payment_context(self):
        self.owner_login()
        for route in [reverse('shop-admin'),reverse('shop-product-new'),reverse('shop-product-edit',args=[self.product.pk]),
            reverse('shop-categories'),reverse('shop-client-wallet',args=[self.org.pk]),reverse('shop-payment-new',args=[self.org.pk])]:
            self.assertEqual(self.client.get(route).status_code,200,route)
        foreign=Request.objects.create(organization=self.other_org,author=self.other,title='Private',body='Private')
        project=Project.objects.create(organization=self.other_org,source=foreign,name='Private project',description='Private')
        response=self.client.post(reverse('shop-payment-new',args=[self.org.pk]),{'title':'Test','description':'Test','amount':'10','project':project.pk})
        self.assertEqual(response.status_code,200)
        self.assertFalse(PaymentRequest.objects.exists())


@skipUnless(connection.vendor=='postgresql','Concurrency and DB immutability require production PostgreSQL')
@override_settings(PASSWORD_HASHERS=['django.contrib.auth.hashers.MD5PasswordHasher'])
class ShopConcurrencyTests(TransactionTestCase):
    def setUp(self):
        setup_data(self)
        adjust_wallet(self.org,self.admin,30000,'Initial test',uuid.uuid4())

    def worker(self,key):
        connections.close_all()
        try:
            return checkout(self.org,self.user,self.cart,'Test',key,self.fingerprint).pk
        except ValidationError:
            return None
        finally:
            connections.close_all()

    def test_concurrent_spending_cannot_overdraw(self):
        with ThreadPoolExecutor(max_workers=2) as pool:
            result=list(pool.map(self.worker,[uuid.uuid4(),uuid.uuid4()]))
        self.assertEqual(sum(x is not None for x in result),1)
        self.assertEqual(Wallet.objects.get(organization=self.org).balance,10000)

    def test_concurrent_same_request_debits_once(self):
        key=uuid.uuid4()
        with ThreadPoolExecutor(max_workers=2) as pool:
            result=list(pool.map(self.worker,[key,key]))
        self.assertEqual(result[0],result[1])
        self.assertEqual(Order.objects.count(),1)

    def test_database_rejects_ledger_update(self):
        entry=WalletTransaction.objects.first()
        with self.assertRaises(DatabaseError), transaction.atomic():
            with connection.cursor() as cursor:
                cursor.execute('UPDATE core_wallettransaction SET amount_cents=999999 WHERE id=%s',[entry.pk])
