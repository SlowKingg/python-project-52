from django.db import models


class Label(models.Model):
    name = models.CharField(
        max_length=255,
        unique=True,
        verbose_name='Имя',
        error_messages={
            'unique': 'already exists',
        },
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ('id',)

    def __str__(self):
        return self.name

