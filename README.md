### Hexlet tests and linter status:
[![Actions Status](https://github.com/SlowKingg/python-project-52/actions/workflows/hexlet-check.yml/badge.svg)](https://github.com/SlowKingg/python-project-52/actions)

[Деплой](https://task-manager-ou5q.onrender.com)

## Render

- Start Command: `make render-start`
- Переменная `PORT` задается Render автоматически; сервер слушает `0.0.0.0:$PORT`.
- Для production добавьте домен Render в `ALLOWED_HOSTS` (например, `task-manager-ou5q.onrender.com`).

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
