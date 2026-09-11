def surface(request):
    from .models import Notification
    from django.conf import settings
    allowed = request.user.is_authenticated and (not request.user.is_staff or request.user.is_verified())
    return {'admin_surface': request.get_host().split(':')[0].startswith('admin.') or request.path.startswith('/admin/'),
        'notification_count':Notification.objects.filter(user=request.user,read_at__isnull=True).count() if allowed else 0,
        'email_enabled':bool(settings.EMAIL_HOST and settings.DEFAULT_FROM_EMAIL)}
