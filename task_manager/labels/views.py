from django.contrib import messages
from django.contrib.auth.mixins import LoginRequiredMixin
from django.shortcuts import redirect
from django.urls import reverse_lazy
from django.views.generic import CreateView, DeleteView, ListView, UpdateView

from .forms import LabelForm
from .models import Label


class LabelListView(LoginRequiredMixin, ListView):
    model = Label
    template_name = 'labels/index.html'
    context_object_name = 'labels'


class LabelCreateView(LoginRequiredMixin, CreateView):
    model = Label
    form_class = LabelForm
    template_name = 'labels/form.html'
    success_url = reverse_lazy('labels_index')

    def form_valid(self, form):
        messages.success(self.request, 'Метка успешно создана')
        return super().form_valid(form)

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['title'] = 'Создать метку'
        context['submit_label'] = 'Создать'
        return context


class LabelUpdateView(LoginRequiredMixin, UpdateView):
    model = Label
    form_class = LabelForm
    template_name = 'labels/form.html'
    success_url = reverse_lazy('labels_index')

    def form_valid(self, form):
        messages.success(self.request, 'Метка успешно изменена')
        return super().form_valid(form)

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['title'] = 'Изменить метку'
        context['submit_label'] = 'Изменить'
        return context


class LabelDeleteView(LoginRequiredMixin, DeleteView):
    model = Label
    template_name = 'labels/delete.html'
    success_url = reverse_lazy('labels_index')

    def form_valid(self, form):
        if self.object.tasks.exists():
            messages.error(self.request, 'Невозможно удалить метку')
            return redirect('labels_index')

        messages.success(self.request, 'Метка успешно удалена')
        return super().form_valid(form)

