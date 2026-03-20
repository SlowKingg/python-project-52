from django.contrib.auth import get_user_model
from django.contrib.messages import get_messages
from django.test import TestCase
from django.urls import reverse
from django.utils.translation import gettext as _

User = get_user_model()


class BaseAuthViewTests(TestCase):
    @classmethod
    def setUpTestData(cls):
        cls.user = User.objects.create_user(
            username="john",
            password="john-pass-123",
        )


class LoginPageViewTests(BaseAuthViewTests):
    def test_adds_success_message_after_login(self):
        response = self.client.post(
            reverse("login"),
            {
                "username": "john",
                "password": "john-pass-123",
            },
            follow=True,
        )

        self.assertRedirects(response, reverse("index"))
        messages = [m.message for m in get_messages(response.wsgi_request)]
        self.assertIn(_("You are logged in"), messages)


class LogoutPageViewTests(BaseAuthViewTests):
    def test_adds_success_message_for_authenticated_user(self):
        self.client.login(username="john", password="john-pass-123")

        response = self.client.post(reverse("logout"), follow=True)

        self.assertRedirects(response, reverse("index"))
        messages = [m.message for m in get_messages(response.wsgi_request)]
        self.assertIn(_("You are logged out"), messages)

