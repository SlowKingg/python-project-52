from django.contrib.auth import get_user_model
from django.db import models
from django.utils.translation import gettext_lazy as _

from task_manager.statuses.models import Status

User = get_user_model()


class Task(models.Model):
    name = models.CharField(
        max_length=255,
        unique=True,
        verbose_name=_('Name'),
        error_messages={
            'unique': _('already exists'),
        },
    )
    description = models.TextField(
        verbose_name=_('Description'),
        blank=True,
    )
    status = models.ForeignKey(
        Status,
        on_delete=models.PROTECT,
        related_name='tasks',
        verbose_name=_('Status'),
    )
    author = models.ForeignKey(
        User,
        on_delete=models.PROTECT,
        related_name='authored_tasks',
        verbose_name=_('Author'),
    )
    executor = models.ForeignKey(
        User,
        on_delete=models.PROTECT,
        related_name='executed_tasks',
        verbose_name=_('Executor'),
        blank=True,
        null=True,
    )
    labels = models.ManyToManyField(
        'labels.Label',
        related_name='tasks',
        verbose_name=_('Labels'),
        blank=True,
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ('id',)

    def __str__(self):
        return self.name

