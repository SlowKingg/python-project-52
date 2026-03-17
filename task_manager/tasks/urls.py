from django.urls import path

from .views import (
    TaskCreateView,
    TaskDeleteView,
    TaskDetailView,
    TaskListView,
    TaskUpdateView,
)

urlpatterns = [
    path('tasks/', TaskListView.as_view(), name='tasks_index'),
    path('tasks/create/', TaskCreateView.as_view(), name='tasks_create'),
    path('tasks/<int:pk>/update/', TaskUpdateView.as_view(), name='tasks_update'),
    path('tasks/<int:pk>/delete/', TaskDeleteView.as_view(), name='tasks_delete'),
    path('tasks/<int:pk>/', TaskDetailView.as_view(), name='tasks_detail'),
]

