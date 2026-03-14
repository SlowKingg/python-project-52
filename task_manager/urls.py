from django.conf.urls.i18n import i18n_patterns
from django.contrib import admin
from django.urls import path, include

from task_manager import views

urlpatterns = [
    path('i18n/', include('django.conf.urls.i18n')),
    path('', views.index, name='index'),
    path('admin/', admin.site.urls),
]
