from django.urls import path
from core import views as v

urlpatterns = [
    path('', v.root), path('client/', v.client_home, name='client-home'),
    path('admin/', v.admin_home, name='admin-home'),
    path('auth/login/', v.signin, name='login'), path('auth/signup/', v.signup, name='signup'),
    path('auth/logout/', v.signout, name='logout'), path('auth/mfa/', v.mfa, name='mfa'),
    path('auth/mfa/qr/', v.mfa_qr, name='mfa-qr'), path('auth/activate/', v.activate_owner, name='activate'),
    path('requests/', v.request_list, name='requests'), path('requests/new/', v.new_request, name='request-new'),
    path('requests/<uuid:pk>/', v.request_detail, name='request-detail'),
    path('requests/<uuid:pk>/status/', v.request_status, name='request-status'),
    path('requests/<uuid:pk>/convert/', v.convert, name='convert'),
    path('projects/', v.projects, name='projects'), path('projects/<uuid:pk>/', v.project_detail, name='project-detail'),
    path('messages/', v.inbox, name='inbox'), path('admin/clients/', v.clients, name='clients'),
    path('admin/clients/<uuid:pk>/', v.client_detail, name='client-detail'),
    path('account/', v.account, name='account'),
    path('manifest-<str:surface>.webmanifest', v.manifest), path('sw.js', v.service_worker),
    path('health/', v.health),
]
