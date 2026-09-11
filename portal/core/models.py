import uuid
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


class LoginAttempt(models.Model):
    key = models.CharField(max_length=64, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)


class OwnerInvite(models.Model):
    digest = models.CharField(max_length=64, unique=True)
    email = models.EmailField()
    expires_at = models.DateTimeField()
    used_at = models.DateTimeField(null=True)
