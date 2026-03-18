# Build script for deployment
.PHONY: build install collectstatic migrate render-start runserver check makemessages compilemessages ruff-check ruff-check-fix ruff-format ruff-format-check

build:
	./build.sh

install:
	uv sync

collectstatic:
	uv run python manage.py collectstatic --noinput

migrate:
	uv run python manage.py migrate --noinput

# Start production server on Render.com
render-start:
	./scripts/with_rollbar_version.sh uv run gunicorn task_manager.wsgi:application --bind 0.0.0.0:$${PORT:-8000}

runserver:
	./scripts/with_rollbar_version.sh uv run python manage.py runserver 0.0.0.0:$${PORT:-8000}

check:
	uv run python manage.py check

ruff-check:
	uv run ruff check .

ruff-check-fix:
	uv run ruff check --fix .

ruff-format:
	uv run ruff format .

ruff-format-check:
	uv run ruff format --check .

makemessages:
	uv run django-admin makemessages -l ru -l en

compilemessages:
	uv run django-admin compilemessages

