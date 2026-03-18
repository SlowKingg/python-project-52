from django import forms
from django.contrib.auth import get_user_model
from django.utils.translation import gettext_lazy as _
from django_filters import FilterSet, ModelChoiceFilter, BooleanFilter

from task_manager.labels.models import Label
from task_manager.statuses.models import Status

from .models import Task

User = get_user_model()


class TaskFilterSet(FilterSet):
    status = ModelChoiceFilter(
        queryset=Status.objects.all(),
        label=_('Status'),
    )
    executor = ModelChoiceFilter(
        queryset=User.objects.order_by('id'),
        label=_('Executor'),
    )
    labels = ModelChoiceFilter(
        queryset=Label.objects.all(),
        label=_('Label'),
        distinct=True,
    )
    self_tasks = BooleanFilter(
        label=_('Only own tasks'),
        method='filter_self_tasks',
        widget=forms.CheckboxInput,
    )

    class Meta:
        model = Task
        fields = []

    def filter_self_tasks(self, queryset, name, value):
        if value and self.request and self.request.user.is_authenticated:
            return queryset.filter(author=self.request.user)
        return queryset


