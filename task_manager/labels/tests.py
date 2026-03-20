from django.contrib.auth import get_user_model
from django.contrib.messages import get_messages
from django.test import TestCase
from django.urls import reverse
from django.utils.translation import gettext as _

from task_manager.labels.models import Label
from task_manager.statuses.models import Status
from task_manager.tasks.models import Task

User = get_user_model()


class LabelDeleteViewTests(TestCase):
    def test_shows_error_when_label_is_linked_to_task(self):
        user = User.objects.create_user(
            username="user",
            password="user-pass-123",
        )
        status = Status.objects.create(name="In progress")
        label = Label.objects.create(name="Urgent")
        task = Task.objects.create(
            name="Task with label",
            status=status,
            author=user,
        )
        task.labels.add(label)

        self.client.login(username="user", password="user-pass-123")
        response = self.client.post(
            reverse("labels_delete", args=[label.pk]),
            follow=True,
        )

        self.assertRedirects(response, reverse("labels_index"))
        self.assertTrue(Label.objects.filter(pk=label.pk).exists())
        messages = [m.message for m in get_messages(response.wsgi_request)]
        self.assertIn(_("Cannot delete label"), messages)

