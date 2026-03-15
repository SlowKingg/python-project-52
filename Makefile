# Build script for deployment
.PHONY: build install collectstatic migrate render-start check makemessages compilemessages

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
	uv run gunicorn task_manager.wsgi:application --bind 0.0.0.0:$${PORT:-8000}

check:
	uv run python manage.py check

makemessages:
	uv run django-admin makemessages -l ru -l en

compilemessages:
	uv run django-admin compilemessages

