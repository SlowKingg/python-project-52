#!/usr/bin/env bash
set -euo pipefail

if [ "$#" -eq 0 ]; then
  echo "Usage: $0 <command> [args...]" >&2
  exit 1
fi

# Respect an explicitly provided release version.
if [ -z "${ROLLBAR_CODE_VERSION:-}" ]; then
  if [ -n "${RENDER_GIT_COMMIT:-}" ]; then
    export ROLLBAR_CODE_VERSION="${RENDER_GIT_COMMIT:0:7}"
  elif git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
    export ROLLBAR_CODE_VERSION="$(git rev-parse --short HEAD)"
  else
    export ROLLBAR_CODE_VERSION="unknown"
  fi
fi

exec "$@"

