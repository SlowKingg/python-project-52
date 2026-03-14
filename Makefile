# Build script for deployment
.PHONY: build install collectstatic migrate render-start

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
	gunicorn task_manager.wsgi

check:
	uv run python manage.py check