### Hexlet tests and linter status:
[![Actions Status](https://github.com/SlowKingg/python-project-52/actions/workflows/hexlet-check.yml/badge.svg)](https://github.com/SlowKingg/python-project-52/actions)

[Деплой](https://task-manager-ou5q.onrender.com)

## Render

- Start Command: `make render-start`
- Переменная `PORT` задается Render автоматически; сервер слушает `0.0.0.0:$PORT`.
- Для production добавьте домен Render в `ALLOWED_HOSTS` (например, `task-manager-ou5q.onrender.com`).
- `ROLLBAR_CODE_VERSION` подставляется автоматически из `RENDER_GIT_COMMIT` (или из git SHA), если не задан вручную.

## Конфигурация окружения

Настройки загружаются из `.env` через `python-dotenv`.

1. Скопируйте шаблон:

```bash
cp .env.example .env
```

2. Для локальной разработки оставьте `POSTGRES_DB` пустым (или не задавайте `DATABASE_URL`) - будет использоваться SQLite (`db.sqlite3`).
3. Для production задайте `DATABASE_URL` вида `postgresql://user:password@host:5432/dbname` или заполните `POSTGRES_*`, тогда включится PostgreSQL.

Основные переменные:

- `DJANGO_ENV` - например, `development` или `production`
- `DEBUG` - `True/False`
- `SECRET_KEY` - секретный ключ Django
- `ALLOWED_HOSTS` - список хостов через запятую

## Rollbar (эксплуатация)

1. Создайте проект в Rollbar и получите `post_server_item` token.
2. Добавьте переменные окружения в Render (или другой hosting):

   - `ROLLBAR_ACCESS_TOKEN` - токен из Rollbar
   - `ROLLBAR_ENVIRONMENT` - например, `production`
   - `ROLLBAR_ENABLED` - `True`
   - `ROLLBAR_CODE_VERSION` - опционально; если не задан, определяется автоматически

3. Задеплойте приложение с этими переменными.

Автоподстановка версии релиза:

- Скрипт `scripts/with_rollbar_version.sh` выбирает значение в таком порядке:
  1) уже заданный `ROLLBAR_CODE_VERSION`; 2) `RENDER_GIT_COMMIT` (первые 7 символов); 3) `git rev-parse --short HEAD`; 4) `unknown`.
- `make render-start` и `make runserver` уже запускаются через этот скрипт.

Локальный запуск с автоподстановкой:

```bash
make runserver
```

Проверка доставки ошибки:

1. Войдите в Rollbar UI и откройте раздел `Items`.
2. В продакшене вызовите контролируемую ошибку (например, временно выполните в Django shell):

```bash
uv run python manage.py shell <<'PY'
import rollbar
from django.conf import settings

rollbar.init(
    settings.ROLLBAR_ACCESS_TOKEN,
    settings.ROLLBAR_ENVIRONMENT,
    code_version=settings.ROLLBAR_CODE_VERSION,
    root=str(settings.BASE_DIR),
)

try:
    1 / 0
except Exception:
    rollbar.report_exc_info()
PY
```

3. Убедитесь, что событие появилось в Rollbar.

