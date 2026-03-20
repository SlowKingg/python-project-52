from django.contrib import messages
from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib.messages.views import SuccessMessageMixin
from django.urls import reverse_lazy
from django.utils.translation import gettext_lazy as _
from django.views.generic import CreateView, DeleteView, DetailView, UpdateView
from django_filters.views import FilterView

from .filters import TaskFilterSet
from .forms import TaskForm
from .mixins import TaskAuthorOnlyMixin
from .models import Task


class TaskListView(LoginRequiredMixin, FilterView):
    template_name = "tasks/index.html"
    context_object_name = "tasks"
    filterset_class = TaskFilterSet
    queryset = Task.objects.select_related(
        "status", "author", "executor"
    ).prefetch_related("labels")


class TaskDetailView(LoginRequiredMixin, DetailView):
    model = Task
    template_name = "tasks/detail.html"


class TaskCreateView(LoginRequiredMixin, SuccessMessageMixin, CreateView):
    model = Task
    form_class = TaskForm
    template_name = "tasks/form.html"
    success_url = reverse_lazy("tasks_index")
    success_message = _("Task has been created successfully")
    extra_context = {
        "title": _("Create task"),
        "submit_label": _("Create"),
    }

    def form_valid(self, form):
        form.instance.author = self.request.user
        return super().form_valid(form)


class TaskUpdateView(LoginRequiredMixin, SuccessMessageMixin, UpdateView):
    model = Task
    form_class = TaskForm
    template_name = "tasks/form.html"
    success_url = reverse_lazy("tasks_index")
    success_message = _("Task has been updated successfully")
    extra_context = {
        "title": _("Update task"),
        "submit_label": _("Update"),
    }


class TaskDeleteView(LoginRequiredMixin, TaskAuthorOnlyMixin, DeleteView):
    model = Task
    template_name = "tasks/delete.html"
    success_url = reverse_lazy("tasks_index")

    def form_valid(self, form):
        messages.success(self.request, _("Task has been deleted successfully"))
        return super().form_valid(form)
