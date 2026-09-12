from pathlib import Path
from django.core.management.base import BaseCommand, CommandError
from django.core.files.uploadedfile import SimpleUploadedFile
from django.db import transaction
from django.utils import timezone
from core.models import Category, Product, ProductImage, User
from core.shop_images import store_image
from core.shop_services import event


class Command(BaseCommand):
    help = 'Import initial idempotent : ne réinitialise jamais un article existant.'

    def add_arguments(self, parser):
        parser.add_argument('--image', required=True)

    @transaction.atomic
    def handle(self, *args, **options):
        if Product.objects.filter(slug='ecran-tactile-15-6').exists():
            self.stdout.write('Article existant conservé sans modification.')
            return
        actor = User.objects.filter(is_superuser=True,is_staff=True,is_active=True).first()
        if not actor:
            raise CommandError('Le propriétaire doit déjà exister.')
        source = Path(options['image'])
        if not source.is_file():
            raise CommandError('Photo source introuvable.')
        category,_ = Category.objects.get_or_create(slug='ecrans',defaults={'name':'Écrans'})
        p = Product.objects.create(name='Écran tactile 15,6 pouces',slug='ecran-tactile-15-6',sku='YV-ECRAN-156',
            category=category,short_description='Écran tactile portable 15,6 pouces Full HD.',
            description='Écran tactile pour compléter votre installation professionnelle. Vérifiez avec YVEXOR la compatibilité avec votre équipement avant commande.',
            price_cents=19999,credits_cents=19999,tax_percent='20.00',shipping_cents=0,
            stock_tracking_enabled=True,stock_quantity=10,availability='AVAILABLE',purchase_with_credits_enabled=True,
            featured=True,status='PUBLISHED',published_at=timezone.now(),
            features={'Taille écran':'15,6 pouces','Définition':'Full HD 1080p','Tactile':'10 points','Fixation':'VESA (dimensions à confirmer)'})
        name = store_image(SimpleUploadedFile(source.name,source.read_bytes()))
        ProductImage.objects.create(product=p,storage_name=name,alt='Écran tactile YVEXOR 15,6 pouces sur support orientable')
        event(actor,'product.initial_import',p,price_cents=19999,stock=10,tax_percent='20.00',shipping_cents=0)
        self.stdout.write('Premier article importé. Aucun portefeuille crédité.')
