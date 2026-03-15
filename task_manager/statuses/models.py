from django.db import models
from django.utils.translation import gettext_lazy as _


class Status(models.Model):
    name = models.CharField(
        max_length=255,
        unique=True,
        verbose_name=_('Name'),
        error_messages={
            'unique': _('already exists'),
        },
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ('id',)

    def __str__(self):
        return self.name

