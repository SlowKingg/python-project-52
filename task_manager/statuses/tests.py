from django.contrib.auth import get_user_model
from django.contrib.messages import get_messages
from django.test import TestCase
from django.urls import reverse
from django.utils.translation import gettext as _

from task_manager.statuses.models import Status
from task_manager.tasks.models import Task

User = get_user_model()


class StatusDeleteViewTests(TestCase):
    def test_shows_error_when_status_is_protected(self):
        user = User.objects.create_user(
            username="user",
            password="user-pass-123",
        )
        status = Status.objects.create(name="Protected status")
        Task.objects.create(
            name="Task with protected status",
            status=status,
            author=user,
        )

        self.client.login(username="user", password="user-pass-123")
        response = self.client.post(
            reverse("statuses_delete", args=[status.pk]),
            follow=True,
        )

        self.assertRedirects(response, reverse("statuses_index"))
        self.assertTrue(Status.objects.filter(pk=status.pk).exists())
        messages = [m.message for m in get_messages(response.wsgi_request)]
        self.assertIn(_("Cannot delete status"), messages)

