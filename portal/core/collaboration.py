import re
import uuid
from pathlib import Path
from django import forms
from django.conf import settings
from django.contrib import messages
from django.core.exceptions import ValidationError
from django.core.files.storage import default_storage
from django.db import transaction
from django.db.models import Sum
from django.http import FileResponse, HttpResponse, JsonResponse
from django.shortcuts import get_object_or_404, redirect, render
from django.urls import reverse
from django.utils import timezone
from django.views.decorators.http import require_POST, require_GET
from .models import Attachment, Notification, Organization, InternalNote, Message, Request
from .services import notify_team, notify_client
from .views import portal_required, team_required, allowed_requests, audit, limited


class UploadForm(forms.Form):
    file = forms.FileField(label='Photo, PDF, texte ou vidéo MP4 (10 Mo maximum)')

    def clean_file(self):
        value = self.cleaned_data['file']
        if value.size > 10 * 1024 * 1024 or value.size == 0:
            raise ValidationError('Choisissez un fichier non vide de moins de 10 Mo.')
        name = value.name.replace('\\','/').rsplit('/',1)[-1]
        if len(name) > 180 or any(ord(char) < 32 for char in name):
            raise ValidationError('Nom de fichier invalide.')
        extension = Path(name).suffix.lower()
        header = value.read(32)
        value.seek(0)
        good = ((extension == '.pdf' and header.startswith(b'%PDF-')) or
                (extension == '.png' and header.startswith(b'\x89PNG\r\n\x1a\n')) or
                (extension in ['.jpg','.jpeg'] and header.startswith(b'\xff\xd8\xff')) or
                (extension == '.webp' and header.startswith(b'RIFF') and header[8:12] == b'WEBP') or
                (extension == '.mp4' and header[4:8] == b'ftyp'))
        if extension == '.txt':
            try:
                content = value.read().decode('utf-8')
                good = '\x00' not in content
            except UnicodeDecodeError:
                good = False
            value.seek(0)
        if not good:
            raise ValidationError('Format non accepté ou contenu incompatible. Utilisez JPG, PNG, WebP, PDF, TXT ou MP4.')
        value.name = name
        return value


@portal_required
@require_POST
def upload(request, pk):
    item = get_object_or_404(allowed_requests(request.user), pk=pk)
    form = UploadForm(request.POST, request.FILES)
    if limited(request, 'upload', str(request.user.pk)):
        return HttpResponse('Trop d’envois. Réessayez dans 15 minutes.',status=429)
    if not form.is_valid():
        messages.error(request,' '.join(str(error) for errors in form.errors.values() for error in errors))
        return redirect('request-detail',pk=pk)
    stored = None
    try:
        with transaction.atomic():
            Organization.objects.select_for_update().get(pk=item.organization_id)
            used = Attachment.objects.filter(request__organization=item.organization).aggregate(size=Sum('size'))['size'] or 0
            total = Attachment.objects.aggregate(size=Sum('size'))['size'] or 0
            data = form.cleaned_data['file']
            if used + data.size > 200 * 1024 * 1024 or total + data.size > 2 * 1024**3:
                messages.error(request,'La capacité de stockage de cette version est atteinte. Contactez YVEXOR.')
                return redirect('request-detail',pk=pk)
            stored = default_storage.save('attachments/'+uuid.uuid4().hex, data)
            attachment = Attachment.objects.create(request=item, uploaded_by=request.user,
                original_name=data.name, storage_name=stored, size=data.size)
            audit(request.user,'attachment.uploaded',attachment.pk)
            target = reverse('request-detail',args=[pk])
            if request.user.is_staff:
                notify_client(item.organization,'Document reçu : '+data.name,target)
            else:
                notify_team('Document reçu : '+data.name,target)
    except Exception:
        if stored:
            default_storage.delete(stored)
        raise
    messages.success(request,'Fichier ajouté au dossier privé.')
    return redirect('request-detail',pk=pk)


@portal_required
@require_GET
def download(request, pk):
    attachment = get_object_or_404(Attachment.objects.filter(request__in=allowed_requests(request.user)),pk=pk)
    audit(request.user,'attachment.downloaded',pk)
    response = FileResponse(default_storage.open(attachment.storage_name,'rb'),as_attachment=True,
        filename=attachment.original_name,content_type='application/octet-stream')
    response['Content-Security-Policy'] = "sandbox; default-src 'none'"
    return response


@portal_required
def documents(request):
    items = Attachment.objects.filter(request__in=allowed_requests(request.user)).select_related('request').order_by('-created_at')
    return render(request,'documents.html',{'documents':items[:200],'team':request.user.is_staff,'section':'documents'})


@portal_required
def notifications(request):
    rows = Notification.objects.filter(user=request.user)
    return render(request,'notifications.html',{'notifications':rows[:100],'team':request.user.is_staff,'section':'notifications'})


@portal_required
@require_POST
def notifications_read(request):
    Notification.objects.filter(user=request.user,read_at__isnull=True).update(read_at=timezone.now())
    return redirect('notifications')


@portal_required
@require_GET
def summary(request):
    from .messaging import unread_count
    rows = Notification.objects.filter(user=request.user,read_at__isnull=True)
    latest = rows.first()
    return JsonResponse({'unread':rows.count(),'chat_unread':unread_count(request.user),'latest':{'id':latest.pk,'title':latest.title,'path':latest.path} if latest else None})


@portal_required
@require_GET
def thread(request, pk):
    item = get_object_or_404(allowed_requests(request.user),pk=pk)
    rows = list(item.thread.select_related('author').order_by('-created_at')[:100])
    return JsonResponse({'messages':[{'id':str(row.pk),'body':row.body,
        'author':'YVEXOR' if row.from_team else row.author.first_name,
        'mine':row.author_id == request.user.pk,'read':bool(row.read_at),
        'date':timezone.localtime(row.created_at).strftime('%d/%m %H:%M')} for row in reversed(rows)]})


@portal_required
@require_POST
def thread_read(request, pk):
    item = get_object_or_404(allowed_requests(request.user),pk=pk)
    item.thread.filter(from_team=not request.user.is_staff,read_at__isnull=True).update(read_at=timezone.now())
    return JsonResponse({'ok':True})


@team_required
@require_POST
def internal_note(request, pk):
    org = get_object_or_404(Organization,pk=pk)
    body = request.POST.get('body','').strip()
    if not body or len(body)>5000:
        return HttpResponse('La note doit contenir entre 1 et 5 000 caractères.',status=400)
    InternalNote.objects.create(organization=org,author=request.user,body=body)
    audit(request.user,'client.internal_note',pk)
    return redirect('client-detail',pk=pk)
