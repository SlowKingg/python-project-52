from django.urls import path

from .views import (
    UserCreateView,
    UserDeleteView,
    UserListView,
    UserUpdateView,
)

urlpatterns = [
    path('users/', UserListView.as_view(), name='users_index'),
    path('users/create/', UserCreateView.as_view(), name='users_create'),
    path('users/<int:pk>/update/', UserUpdateView.as_view(), name='users_update'),
    path('users/<int:pk>/delete/', UserDeleteView.as_view(), name='users_delete'),
]

