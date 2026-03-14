# Build script for deployment
build:
	./build.sh

# Start production server on Render.com
render-start:
	gunicorn task_manager.wsgi
