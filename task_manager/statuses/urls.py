from django.urls import path

from .views import (
    StatusCreateView,
    StatusDeleteView,
    StatusListView,
    StatusUpdateView,
)

urlpatterns = [
    path("statuses/", StatusListView.as_view(), name="statuses_index"),
    path(
        "statuses/create/", StatusCreateView.as_view(), name="statuses_create"
    ),
    path(
        "statuses/<int:pk>/update/",
        StatusUpdateView.as_view(),
        name="statuses_update",
    ),
    path(
        "statuses/<int:pk>/delete/",
        StatusDeleteView.as_view(),
        name="statuses_delete",
    ),
]
