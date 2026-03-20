from django.contrib.auth import get_user_model
from django.contrib.messages import get_messages
from django.test import TestCase
from django.urls import reverse
from django.utils.translation import gettext as _

from task_manager.statuses.models import Status
from task_manager.tasks.models import Task

User = get_user_model()


class BaseTaskViewTests(TestCase):
    @classmethod
    def setUpTestData(cls):
        cls.author = User.objects.create_user(
            username="author",
            password="author-pass-123",
        )
        cls.other_user = User.objects.create_user(
            username="other",
            password="other-pass-123",
        )
        cls.status = Status.objects.create(name="In progress")


class TaskCreateViewTests(BaseTaskViewTests):
    def test_sets_author_from_request_user(self):
        self.client.login(username="author", password="author-pass-123")

        response = self.client.post(
            reverse("tasks_create"),
            {
                "name": "New task",
                "description": "Task description",
                "status": self.status.pk,
                "executor": "",
                "labels": [],
            },
        )

        self.assertRedirects(response, reverse("tasks_index"))
        task = Task.objects.get(name="New task")
        self.assertEqual(task.author, self.author)


class TaskDeleteViewTests(BaseTaskViewTests):
    def test_denies_delete_for_non_author(self):
        task = Task.objects.create(
            name="Task to keep",
            description="",
            status=self.status,
            author=self.author,
        )
        self.client.login(username="other", password="other-pass-123")

        response = self.client.post(
            reverse("tasks_delete", args=[task.pk]),
            follow=True,
        )

        self.assertRedirects(response, reverse("tasks_index"))
        self.assertTrue(Task.objects.filter(pk=task.pk).exists())
        messages = [m.message for m in get_messages(response.wsgi_request)]
        self.assertIn(_("A task can only be deleted by its author"), messages)


class TaskListViewTests(BaseTaskViewTests):
    def test_self_tasks_filter_shows_only_own_tasks(self):
        own_task = Task.objects.create(
            name="Own task",
            status=self.status,
            author=self.author,
        )
        Task.objects.create(
            name="Foreign task",
            status=self.status,
            author=self.other_user,
        )

        self.client.login(username="author", password="author-pass-123")
        response = self.client.get(reverse("tasks_index"), {"self_tasks": "on"})

        self.assertEqual(response.status_code, 200)
        tasks = list(response.context["tasks"])
        self.assertEqual(tasks, [own_task])

