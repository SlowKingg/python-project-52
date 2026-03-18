from django.contrib import messages
from django.contrib.auth.views import LoginView, LogoutView
from django.http import HttpResponse
from django.shortcuts import render
from django.utils.translation import gettext_lazy as _
from django.urls import reverse_lazy


def index(request):
    return render(request, 'index.html')


class LoginPageView(LoginView):
    template_name = 'registration/login.html'
    redirect_authenticated_user = True

    def form_valid(self, form):
        messages.success(self.request, _('You are logged in'))
        return super().form_valid(form)


class LogoutPageView(LogoutView):
    http_method_names = ['post', 'options']
    next_page = reverse_lazy('index')

    def dispatch(self, request, *args, **kwargs):
        was_authenticated = request.user.is_authenticated
        response = super().dispatch(request, *args, **kwargs)
        if was_authenticated:
            messages.success(request, _('You are logged out'))
        return response


def test_error(request):
    """Trigger a test error for Rollbar."""
    a = None
    a.hello()
    return HttpResponse('This will not be reached')


