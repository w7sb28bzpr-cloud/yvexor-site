import uuid
from django.db import models
from django.db.models import Q, Sum
from django.utils import timezone


class AppendOnlyQuerySet(models.QuerySet):
    def update(self, **kwargs):
        raise ValueError('Historique immuable : créer une écriture corrective.')

    def delete(self):
        raise ValueError('Historique immuable.')


class AppendOnly(models.Model):
    objects = AppendOnlyQuerySet.as_manager()

    def save(self, *args, **kwargs):
        if not self._state.adding:
            raise ValueError('Historique immuable.')
        return super().save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        raise ValueError('Historique immuable.')

    class Meta:
        abstract = True


class Category(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)
    position = models.PositiveIntegerField(default=0)
    active = models.BooleanField(default=True)

    class Meta:
        ordering = ['position', 'name']

    def __str__(self):
        return self.name


class Product(models.Model):
    STATES = [('DRAFT', 'Brouillon'), ('PUBLISHED', 'Publié'), ('ARCHIVED', 'Archivé')]
    AVAILABILITY = [('AVAILABLE', 'Disponible'), ('UNAVAILABLE', 'Indisponible'), ('PREORDER', 'Précommande')]
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=160)
    slug = models.SlugField(max_length=180, unique=True)
    sku = models.CharField(max_length=80, unique=True)
    category = models.ForeignKey(Category, on_delete=models.PROTECT)
    short_description = models.CharField(max_length=400)
    description = models.TextField(max_length=10000, blank=True)
    price_cents = models.PositiveIntegerField()
    credits_cents = models.PositiveIntegerField()
    tax_percent = models.DecimalField(max_digits=5, decimal_places=2)
    shipping_cents = models.PositiveIntegerField(default=0)
    stock_tracking_enabled = models.BooleanField(default=True)
    stock_quantity = models.PositiveIntegerField(null=True, blank=True)
    low_stock_threshold = models.PositiveIntegerField(default=2)
    availability = models.CharField(max_length=16, choices=AVAILABILITY, default='UNAVAILABLE')
    preorder_enabled = models.BooleanField(default=False)
    purchase_with_credits_enabled = models.BooleanField(default=False)
    status = models.CharField(max_length=12, choices=STATES, default='DRAFT')
    featured = models.BooleanField(default=False)
    features = models.JSONField(default=dict, blank=True)
    published_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-featured', 'name']
        permissions = [('publish_product','Publier les articles'),('archive_product','Archiver les articles')]
        constraints = [
            models.CheckConstraint(condition=Q(price_cents__gt=0) & Q(credits_cents__gt=0), name='product_positive_price'),
            models.CheckConstraint(condition=Q(tax_percent__gte=0) & Q(tax_percent__lte=100), name='product_valid_tax'),
            models.CheckConstraint(condition=Q(stock_tracking_enabled=False) | Q(stock_quantity__isnull=False), name='product_tracked_quantity'),
        ]

    @property
    def is_public(self):
        return self.status == 'PUBLISHED' and self.category.active and self.published_at and self.published_at <= timezone.now()

    @property
    def available(self):
        if not self.is_public or not self.purchase_with_credits_enabled:
            return False
        if self.availability == 'PREORDER':
            return self.preorder_enabled
        return self.availability == 'AVAILABLE' and (not self.stock_tracking_enabled or self.stock_quantity > 0)

    def __str__(self):
        return self.name

    @property
    def main_image(self):
        return self.images.filter(active=True).first()


class ProductImage(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    product = models.ForeignKey(Product, on_delete=models.PROTECT, related_name='images')
    storage_name = models.CharField(max_length=100, unique=True)
    alt = models.CharField(max_length=240)
    position = models.PositiveIntegerField(default=0)
    active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['position', 'created_at']


class Wallet(models.Model):
    organization = models.OneToOneField('core.Organization', on_delete=models.PROTECT)
    status = models.CharField(max_length=12, choices=[('ACTIVE', 'Actif'), ('FROZEN', 'Suspendu')], default='ACTIVE')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        permissions = [('adjust_wallet','Créer une écriture de correction du portefeuille')]

    @property
    def balance(self):
        return self.transactions.aggregate(total=Sum('amount_cents'))['total'] or 0


class WalletTransaction(AppendOnly):
    TYPES = [('TOPUP', 'Recharge'), ('ADJUSTMENT', 'Correction'), ('PURCHASE', 'Achat'), ('SERVICE', 'Prestation'), ('REFUND', 'Remboursement')]
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    wallet = models.ForeignKey(Wallet, on_delete=models.PROTECT, related_name='transactions')
    type = models.CharField(max_length=12, choices=TYPES)
    amount_cents = models.BigIntegerField()
    status = models.CharField(max_length=10, default='POSTED', editable=False)
    reference_type = models.CharField(max_length=30)
    reference_id = models.CharField(max_length=80)
    description = models.CharField(max_length=500)
    created_by = models.ForeignKey('core.User', on_delete=models.PROTECT)
    idempotency_key = models.CharField(max_length=160, unique=True)
    reversal_of = models.OneToOneField('self', on_delete=models.PROTECT, null=True, blank=True, related_name='reversal')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        constraints = [models.CheckConstraint(condition=~Q(amount_cents=0), name='ledger_nonzero'), models.CheckConstraint(condition=Q(status='POSTED'), name='ledger_posted')]


class Order(models.Model):
    STATES = [(x, y) for x, y in [('PENDING','En attente'),('PAID','Payée'),('PREPARING','En préparation'),('READY_FOR_PICKUP','Prête'),('SHIPPED','Expédiée'),('DELIVERED','Livrée'),('CANCELLED','Annulée'),('REFUNDED','Remboursée')]]
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    organization = models.ForeignKey('core.Organization', on_delete=models.PROTECT)
    created_by = models.ForeignKey('core.User', on_delete=models.PROTECT)
    status = models.CharField(max_length=20, choices=STATES, default='PENDING')
    total_cents = models.PositiveIntegerField()
    credits_cents = models.PositiveIntegerField()
    shipping_cents = models.PositiveIntegerField()
    shipping_address = models.TextField(max_length=1500)
    idempotency_key = models.UUIDField(unique=True)
    debit = models.OneToOneField(WalletTransaction, null=True, on_delete=models.PROTECT)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        permissions = [('refund_order','Rembourser une commande')]

    @property
    def reference(self):
        return 'YV-' + str(self.pk).upper()


class OrderItem(AppendOnly):
    order = models.ForeignKey(Order, on_delete=models.PROTECT, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.PROTECT)
    name = models.CharField(max_length=160)
    sku = models.CharField(max_length=80)
    quantity = models.PositiveIntegerField()
    price_cents = models.PositiveIntegerField()
    credits_cents = models.PositiveIntegerField()
    tax_percent = models.DecimalField(max_digits=5, decimal_places=2)
    stock_decremented = models.BooleanField(default=False)


class OrderStatusHistory(AppendOnly):
    order = models.ForeignKey(Order, on_delete=models.PROTECT, related_name='history')
    status = models.CharField(max_length=20)
    reason = models.CharField(max_length=500)
    actor = models.ForeignKey('core.User', on_delete=models.PROTECT)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['created_at', 'pk']


class PaymentRequest(models.Model):
    STATES = [('DRAFT','Brouillon'),('SENT','Envoyée'),('VIEWED','Vue'),('PAID','Payée'),('EXPIRED','Expirée'),('CANCELLED','Annulée')]
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    organization = models.ForeignKey('core.Organization', on_delete=models.PROTECT)
    project = models.ForeignKey('core.Project', null=True, blank=True, on_delete=models.PROTECT)
    quote = models.ForeignKey('core.Quote', null=True, blank=True, on_delete=models.PROTECT)
    message = models.OneToOneField('core.DirectMessage', null=True, on_delete=models.PROTECT)
    title = models.CharField(max_length=160)
    description = models.TextField(max_length=4000)
    amount_cents = models.PositiveIntegerField()
    credits_cents = models.PositiveIntegerField()
    status = models.CharField(max_length=12, choices=STATES, default='DRAFT')
    expires_at = models.DateTimeField(null=True, blank=True)
    created_by = models.ForeignKey('core.User', on_delete=models.PROTECT)
    sent_at = models.DateTimeField(null=True)
    viewed_at = models.DateTimeField(null=True)
    paid_at = models.DateTimeField(null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    debit = models.OneToOneField(WalletTransaction, null=True, on_delete=models.PROTECT)

    class Meta:
        ordering = ['-created_at']
        permissions = [('cancel_paymentrequest','Annuler une demande de paiement')]
        constraints = [models.CheckConstraint(condition=Q(amount_cents__gt=0) & Q(credits_cents__gt=0), name='payment_positive')]


class PaymentStatusHistory(AppendOnly):
    payment = models.ForeignKey(PaymentRequest, on_delete=models.PROTECT, related_name='history')
    status = models.CharField(max_length=12)
    reason = models.CharField(max_length=500)
    actor = models.ForeignKey('core.User', on_delete=models.PROTECT)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['created_at', 'pk']


class CreditTopup(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    wallet = models.ForeignKey(Wallet, on_delete=models.PROTECT)
    amount_cents = models.PositiveIntegerField()
    status = models.CharField(max_length=20, default='UNAVAILABLE')
    provider_reference = models.CharField(max_length=200, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)


class ShopEvent(AppendOnly):
    actor = models.ForeignKey('core.User', on_delete=models.PROTECT)
    action = models.CharField(max_length=80)
    reference = models.CharField(max_length=80)
    details = models.JSONField(default=dict)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
