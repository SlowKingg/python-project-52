from django.contrib import messages
from django.contrib.auth import get_user_model
from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib.messages.views import SuccessMessageMixin
from django.db.models import ProtectedError
from django.shortcuts import redirect
from django.urls import reverse_lazy
from django.utils.translation import gettext_lazy as _
from django.views.generic import CreateView, DeleteView, ListView, UpdateView

from .forms import UserCreateForm
from .mixins import CurrentUserOnlyMixin

User = get_user_model()


class UserListView(ListView):
    model = User
    template_name = "users/index.html"
    context_object_name = "users"


class UserCreateView(SuccessMessageMixin, CreateView):
    form_class = UserCreateForm
    template_name = "users/form.html"
    success_url = reverse_lazy("login")
    success_message = _("User has been registered successfully")
    extra_context = {
        "title": _("Sign up"),
        "submit_label": _("Register"),
    }


class UserUpdateView(
    LoginRequiredMixin,
    CurrentUserOnlyMixin,
    SuccessMessageMixin,
    UpdateView,
):
    model = User
    form_class = UserCreateForm
    template_name = "users/form.html"
    success_url = reverse_lazy("users_index")
    success_message = _("User has been updated successfully")
    extra_context = {
        "title": _("Update user"),
        "submit_label": _("Update"),
    }


class UserDeleteView(LoginRequiredMixin, CurrentUserOnlyMixin, DeleteView):
    model = User
    template_name = "users/delete.html"
    success_url = reverse_lazy("users_index")

    def form_valid(self, form):
        try:
            response = super().form_valid(form)
        except ProtectedError:
            messages.error(self.request, _("Cannot delete user"))
            return redirect("users_index")

        messages.success(self.request, _("User has been deleted successfully"))
        return response
