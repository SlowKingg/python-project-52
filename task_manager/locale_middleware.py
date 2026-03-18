from django.conf import settings
from django.conf.urls.i18n import is_language_prefix_patterns_used
from django.middleware.locale import LocaleMiddleware
from django.utils import translation


class DefaultLanguageLocaleMiddleware(LocaleMiddleware):
    """Prefer explicit user choice.

    Otherwise fall back to the project default language.
    """

    def process_request(self, request):
        urlconf = getattr(request, "urlconf", settings.ROOT_URLCONF)
        i18n_patterns_used, _ = is_language_prefix_patterns_used(urlconf)

        language = None
        if i18n_patterns_used:
            language = translation.get_language_from_path(request.path_info)

        language_cookie = request.COOKIES.get(settings.LANGUAGE_COOKIE_NAME)
        if (
            not language
            and language_cookie
            and translation.check_for_language(language_cookie)
        ):
            language = language_cookie

        if not language:
            language = settings.LANGUAGE_CODE

        translation.activate(language)
        request.LANGUAGE_CODE = translation.get_language()
