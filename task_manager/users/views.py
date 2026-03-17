from django.contrib import messages
from django.contrib.auth import get_user_model
from django.contrib.auth.mixins import LoginRequiredMixin
from django.db.models import ProtectedError
from django.shortcuts import redirect
from django.urls import reverse_lazy
from django.utils.translation import gettext_lazy as _
from django.views.generic import CreateView, DeleteView, ListView, UpdateView

from .forms import UserCreateForm, UserUpdateForm
from .mixins import CurrentUserOnlyMixin

User = get_user_model()


class UserListView(ListView):
    model = User
    template_name = 'users/index.html'
    context_object_name = 'users'


class UserCreateView(CreateView):
    form_class = UserCreateForm
    template_name = 'users/form.html'
    success_url = reverse_lazy('login')

    def form_valid(self, form):
        messages.success(self.request, _('User has been registered successfully'))
        return super().form_valid(form)

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['title'] = _('Sign up')
        context['submit_label'] = _('Register')
        return context



class UserUpdateView(LoginRequiredMixin, CurrentUserOnlyMixin, UpdateView):
    model = User
    form_class = UserUpdateForm
    template_name = 'users/form.html'
    success_url = reverse_lazy('users_index')

    def form_valid(self, form):
        messages.success(self.request, _('User has been updated successfully'))
        return super().form_valid(form)

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['title'] = _('Update user')
        context['submit_label'] = _('Update')
        return context


class UserDeleteView(LoginRequiredMixin, CurrentUserOnlyMixin, DeleteView):
    model = User
    template_name = 'users/delete.html'
    success_url = reverse_lazy('users_index')

    def form_valid(self, form):
        try:
            response = super().form_valid(form)
        except ProtectedError:
            messages.error(self.request, _('Cannot delete user'))
            return redirect('users_index')

        messages.success(self.request, _('User has been deleted successfully'))
        return response



