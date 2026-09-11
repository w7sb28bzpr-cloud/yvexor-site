def surface(request):
    return {'admin_surface': request.get_host().split(':')[0].startswith('admin.') or request.path.startswith('/admin/')}
