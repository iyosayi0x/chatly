
from django.contrib import admin
from django.urls import path , include , re_path
from django.views.generic import TemplateView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('accounts/', include('accounts.urls')),
    path('profile/', include('user_profile.urls')),
    path('chat/', include('chat.urls')),
    path('api-auth/', include('rest_framework.urls'))
]

urlpatterns += [re_path(r'^.*', TemplateView.as_view(template_name='index.html'))]