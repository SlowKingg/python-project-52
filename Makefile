# Build script for deployment
.PHONY: build install collectstatic migrate render-start check

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
	uv run gunicorn task_manager.wsgi:application

check:
	uv run python manage.py check