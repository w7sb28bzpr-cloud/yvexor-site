import uuid
from decimal import Decimal
from django.contrib.auth.models import AbstractUser
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models
from django.db.models.functions import Lower


class User(AbstractUser):
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=32, blank=True)
    email_verified = models.BooleanField(default=False)

    class Meta:
        constraints = [models.UniqueConstraint(Lower('email'), name='unique_normalized_email')]


class Organization(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=160)
    created_at = models.DateTimeField(auto_now_add=True)


class Membership(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE)

    class Meta:
        constraints = [models.UniqueConstraint(fields=['user', 'organization'], name='unique_membership')]


class Request(models.Model):
    STATES = [('new', 'Nouvelle'), ('analysis', 'À analyser'), ('info', 'Informations nécessaires'),
              ('proposal', 'Proposition en préparation'), ('project', 'Transformée en projet'),
              ('refused', 'Refusée'), ('done', 'Terminée')]
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    organization = models.ForeignKey(Organization, on_delete=models.PROTECT)
    author = models.ForeignKey(User, on_delete=models.PROTECT)
    title = models.CharField(max_length=160)
    body = models.TextField(max_length=10000)
    details = models.TextField(max_length=3000, blank=True)
    status = models.CharField(max_length=16, choices=STATES, default='new')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-updated_at']


class Project(models.Model):
    STATES = [('analysis', 'Analyse'), ('proposal', 'Proposition'), ('design', 'Conception'),
              ('development', 'Développement'), ('tests', 'Tests'), ('validation', 'Validation'),
              ('production', 'Mise en production'), ('done', 'Terminé')]
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    organization = models.ForeignKey(Organization, on_delete=models.PROTECT)
    source = models.OneToOneField(Request, on_delete=models.PROTECT)
    name = models.CharField(max_length=160)
    description = models.TextField(max_length=10000)
    status = models.CharField(max_length=20, choices=STATES, default='analysis')
    progress = models.PositiveSmallIntegerField(default=0, validators=[MinValueValidator(0), MaxValueValidator(100)])
    updated_at = models.DateTimeField(auto_now=True)


class Message(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    request = models.ForeignKey(Request, on_delete=models.CASCADE, related_name='thread')
    author = models.ForeignKey(User, on_delete=models.PROTECT)
    body = models.TextField(max_length=10000)
    from_team = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    read_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ['created_at']


class AuditEvent(models.Model):
    actor = models.ForeignKey(User, null=True, on_delete=models.SET_NULL)
    action = models.CharField(max_length=64)
    object_id = models.CharField(max_length=64, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)


class DirectMessage(models.Model):
    organization = models.ForeignKey(Organization, on_delete=models.PROTECT, related_name='direct_messages')
    author = models.ForeignKey(User, on_delete=models.PROTECT)
    body = models.TextField(max_length=10000)
    from_team = models.BooleanField(default=False)
    client_nonce = models.UUIDField(default=uuid.uuid4)
    created_at = models.DateTimeField(auto_now_add=True)
    read_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ['id']
        constraints = [models.UniqueConstraint(fields=['author', 'client_nonce'], name='unique_direct_message_send')]
        indexes = [models.Index(fields=['organization', 'id'])]


class LoginAttempt(models.Model):
    key = models.CharField(max_length=64, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)


class OwnerInvite(models.Model):
    digest = models.CharField(max_length=64, unique=True)
    email = models.EmailField()
    expires_at = models.DateTimeField()
    used_at = models.DateTimeField(null=True)


class Attachment(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    request = models.ForeignKey(Request, on_delete=models.PROTECT, related_name='attachments')
    uploaded_by = models.ForeignKey(User, on_delete=models.PROTECT)
    original_name = models.CharField(max_length=180)
    storage_name = models.CharField(max_length=80, unique=True)
    size = models.PositiveIntegerField()
    created_at = models.DateTimeField(auto_now_add=True)


class Notification(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    path = models.CharField(max_length=240)
    created_at = models.DateTimeField(auto_now_add=True)
    read_at = models.DateTimeField(null=True)

    class Meta:
        ordering = ['-created_at']


class InternalNote(models.Model):
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE)
    author = models.ForeignKey(User, on_delete=models.PROTECT)
    body = models.TextField(max_length=5000)
    created_at = models.DateTimeField(auto_now_add=True)


class Solution(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    organization = models.ForeignKey(Organization, on_delete=models.PROTECT)
    name = models.CharField(max_length=160)
    description = models.TextField(max_length=2000, blank=True)
    url = models.URLField(max_length=500)
    active = models.BooleanField(default=True)


class Quote(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    request = models.ForeignKey(Request, on_delete=models.PROTECT, related_name='quotes')
    title = models.CharField(max_length=160)
    issuer_name = models.CharField(max_length=160)
    issuer_details = models.TextField(max_length=2000)
    client_details = models.TextField(max_length=2000)
    currency = models.CharField(max_length=3, choices=[('EUR', 'EUR'), ('CHF', 'CHF')])
    valid_until = models.DateField()
    conditions = models.TextField(max_length=5000)
    status = models.CharField(max_length=12, choices=[('draft','Brouillon'),('sent','Envoyé'),('accepted','Accepté'),('refused','Refusé')], default='draft')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    @property
    def reference(self):
        return 'YVX-' + str(self.pk).upper()


class QuoteItem(models.Model):
    quote = models.ForeignKey(Quote, on_delete=models.CASCADE, related_name='items')
    label = models.CharField(max_length=240)
    quantity = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(Decimal('0.01'))])
    unit_price = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0)])
    tax_rate = models.DecimalField(max_digits=5, decimal_places=2, validators=[MinValueValidator(0), MaxValueValidator(100)])
    discount = models.DecimalField(max_digits=5, decimal_places=2, default=0, validators=[MinValueValidator(0), MaxValueValidator(100)])
    position = models.PositiveSmallIntegerField(default=0)

    class Meta:
        ordering = ['position','id']


class QuoteVersion(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    quote = models.ForeignKey(Quote, on_delete=models.PROTECT, related_name='versions')
    number = models.PositiveIntegerField()
    snapshot = models.JSONField()
    sent_by = models.ForeignKey(User, on_delete=models.PROTECT)
    sent_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [models.UniqueConstraint(fields=['quote','number'], name='unique_quote_version')]
        ordering = ['-number']


class QuoteDecision(models.Model):
    version = models.OneToOneField(QuoteVersion, on_delete=models.PROTECT)
    user = models.ForeignKey(User, on_delete=models.PROTECT)
    decision = models.CharField(max_length=12, choices=[('accepted','Accepté'),('refused','Refusé')])
    decided_at = models.DateTimeField(auto_now_add=True)


from .shop_models import (Category, Product, ProductImage, Wallet, WalletTransaction,
    Order, OrderItem, OrderStatusHistory, PaymentRequest, PaymentStatusHistory, CreditTopup, ShopEvent)
