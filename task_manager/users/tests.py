from django.contrib.auth import get_user_model
from django.contrib.messages import get_messages
from django.test import TestCase
from django.urls import reverse
from django.utils.translation import gettext as _

from task_manager.statuses.models import Status
from task_manager.tasks.models import Task

User = get_user_model()


class BaseUserViewTests(TestCase):
    @classmethod
    def setUpTestData(cls):
        cls.user = User.objects.create_user(
            username="alice",
            password="alice-pass-123",
        )
        cls.other_user = User.objects.create_user(
            username="bob",
            password="bob-pass-123",
        )


class UserUpdateViewTests(BaseUserViewTests):
    def test_forbids_update_for_another_user(self):
        self.client.login(username="alice", password="alice-pass-123")

        response = self.client.get(
            reverse("users_update", args=[self.other_user.pk]),
            follow=True,
        )

        self.assertRedirects(response, reverse("users_index"))
        messages = [m.message for m in get_messages(response.wsgi_request)]
        self.assertIn(
            _("You do not have permission to update another user."),
            messages,
        )


class UserDeleteViewTests(BaseUserViewTests):
    def test_shows_error_when_user_is_protected(self):
        status = Status.objects.create(name="In progress")
        Task.objects.create(
            name="Task by protected user",
            status=status,
            author=self.user,
        )
        self.client.login(username="alice", password="alice-pass-123")

        response = self.client.post(
            reverse("users_delete", args=[self.user.pk]),
            follow=True,
        )

        self.assertRedirects(response, reverse("users_index"))
        self.assertTrue(User.objects.filter(pk=self.user.pk).exists())
        messages = [m.message for m in get_messages(response.wsgi_request)]
        self.assertIn(_("Cannot delete user"), messages)
