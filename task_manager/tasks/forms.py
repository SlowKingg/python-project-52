from django import forms
from django.utils.translation import gettext_lazy as _

from .models import Task


class TaskForm(forms.ModelForm):
    labels = forms.MultipleChoiceField(
        required=False,
        choices=(),
        label=_('Labels'),
    )

    class Meta:
        model = Task
        fields = ('name', 'description', 'status', 'executor')
        labels = {
            'name': _('Name'),
            'description': _('Description'),
            'status': _('Status'),
            'executor': _('Executor'),
        }

