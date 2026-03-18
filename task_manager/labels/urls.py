from django.urls import path

from .views import (
    LabelCreateView,
    LabelDeleteView,
    LabelListView,
    LabelUpdateView,
)

urlpatterns = [
    path("labels/", LabelListView.as_view(), name="labels_index"),
    path("labels/create/", LabelCreateView.as_view(), name="labels_create"),
    path(
        "labels/<int:pk>/update/",
        LabelUpdateView.as_view(),
        name="labels_update",
    ),
    path(
        "labels/<int:pk>/delete/",
        LabelDeleteView.as_view(),
        name="labels_delete",
    ),
]
