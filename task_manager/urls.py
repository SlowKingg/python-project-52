from django.contrib import admin
from django.urls import path, include

from task_manager import views

urlpatterns = [
    path('i18n/', include('django.conf.urls.i18n')),
    path('', views.index, name='index'),
    path('login/', views.LoginPageView.as_view(), name='login'),
    path('logout/', views.LogoutPageView.as_view(), name='logout'),
    path('', include('task_manager.users.urls')),
    path('', include('task_manager.statuses.urls')),
    path('', include('task_manager.labels.urls')),
    path('', include('task_manager.tasks.urls')),
    path('admin/', admin.site.urls),
]
