import hashlib
import os
import secrets
from datetime import timedelta
from pathlib import Path
from django.conf import settings
from django.core.management.base import BaseCommand, CommandError
from django.utils import timezone
from core.models import OwnerInvite, User


class Command(BaseCommand):
    help = 'Create a one-use owner activation code in a private file, never stdout.'

    def add_arguments(self, parser):
        parser.add_argument('--output', required=True)

    def handle(self, *args, **options):
        if not settings.OWNER_EMAIL:
            raise CommandError('Configure PORTAL_OWNER_EMAIL first')
        if User.objects.filter(email__iexact=settings.OWNER_EMAIL).exists():
            raise CommandError('Owner already exists; no replacement or privilege change performed')
        destination = Path(options['output'])
        if destination.exists():
            raise CommandError('Output already exists; refusing to overwrite')
        code = secrets.token_urlsafe(32)
        fd = os.open(destination, os.O_WRONLY | os.O_CREAT | os.O_EXCL, 0o600)
        with os.fdopen(fd, 'w') as stream:
            stream.write(code + '\n')
        OwnerInvite.objects.create(email=settings.OWNER_EMAIL,
            digest=hashlib.sha256(code.encode()).hexdigest(), expires_at=timezone.now()+timedelta(hours=24))
        self.stdout.write('Private one-use activation file created. Expires in 24 hours.')
