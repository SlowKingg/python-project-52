from django.contrib import messages
from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib.messages.views import SuccessMessageMixin
from django.db.models import ProtectedError
from django.shortcuts import redirect
from django.urls import reverse_lazy
from django.utils.translation import gettext_lazy as _
from django.views.generic import CreateView, DeleteView, ListView, UpdateView

from .forms import StatusForm
from .models import Status


class StatusListView(LoginRequiredMixin, ListView):
    model = Status
    template_name = "statuses/index.html"
    context_object_name = "statuses"


class StatusCreateView(LoginRequiredMixin, SuccessMessageMixin, CreateView):
    model = Status
    form_class = StatusForm
    template_name = "shared/form.html"
    success_url = reverse_lazy("statuses_index")
    success_message = _("Status has been created successfully")
    extra_context = {
        "title": _("Create status"),
        "submit_label": _("Create"),
    }


class StatusUpdateView(LoginRequiredMixin, SuccessMessageMixin, UpdateView):
    model = Status
    form_class = StatusForm
    template_name = "shared/form.html"
    success_url = reverse_lazy("statuses_index")
    success_message = _("Status has been updated successfully")
    extra_context = {
        "title": _("Update status"),
        "submit_label": _("Update"),
    }


class StatusDeleteView(LoginRequiredMixin, DeleteView):
    model = Status
    template_name = "shared/delete.html"
    success_url = reverse_lazy("statuses_index")
    extra_context = {
        "title": _("Delete status"),
    }

    def form_valid(self, form):
        try:
            response = super().form_valid(form)
        except ProtectedError:
            messages.error(self.request, _("Cannot delete status"))
            return redirect("statuses_index")

        messages.success(
            self.request, _("Status has been deleted successfully")
        )
        return response
