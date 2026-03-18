from django.contrib import messages
from django.contrib.auth.mixins import LoginRequiredMixin
from django.urls import reverse_lazy
from django.utils.translation import gettext as _
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

    def get_queryset(self):
        return Task.objects.select_related(
            "status", "author", "executor"
        ).prefetch_related("labels")

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context["filter_form"] = context["filter"].form
        return context


class TaskDetailView(LoginRequiredMixin, DetailView):
    model = Task
    template_name = "tasks/detail.html"


class TaskCreateView(LoginRequiredMixin, CreateView):
    model = Task
    form_class = TaskForm
    template_name = "tasks/form.html"
    success_url = reverse_lazy("tasks_index")

    def form_valid(self, form):
        form.instance.author = self.request.user
        messages.success(self.request, _("Task has been created successfully"))
        return super().form_valid(form)

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context["title"] = _("Create task")
        context["submit_label"] = _("Create")
        return context


class TaskUpdateView(LoginRequiredMixin, UpdateView):
    model = Task
    form_class = TaskForm
    template_name = "tasks/form.html"
    success_url = reverse_lazy("tasks_index")

    def form_valid(self, form):
        messages.success(self.request, _("Task has been updated successfully"))
        return super().form_valid(form)

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context["title"] = _("Update task")
        context["submit_label"] = _("Update")
        return context


class TaskDeleteView(LoginRequiredMixin, TaskAuthorOnlyMixin, DeleteView):
    model = Task
    template_name = "tasks/delete.html"
    success_url = reverse_lazy("tasks_index")

    def form_valid(self, form):
        messages.success(self.request, _("Task has been deleted successfully"))
        return super().form_valid(form)
