import os
from urllib.parse import parse_qs, unquote, urlparse


def get_env_bool(name, default=False):
    value = os.getenv(name)
    if value is None:
        return default
    return value.strip().lower() in {"1", "true", "yes", "on"}


def get_env_list(name, default=""):
    value = os.getenv(name, default)
    return [item.strip() for item in value.split(",") if item.strip()]


def get_postgres_from_url(database_url):
    parsed = urlparse(database_url)
    if parsed.scheme not in {"postgres", "postgresql"}:
        raise ValueError(
            "DATABASE_URL must start with postgres:// or postgresql://"
        )

    db_config: dict[str, object] = {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": unquote(parsed.path.lstrip("/")),
        "USER": unquote(parsed.username or ""),
        "PASSWORD": unquote(parsed.password or ""),
        "HOST": parsed.hostname or "localhost",
    }

    if parsed.port:
        db_config["PORT"] = str(parsed.port)

    query = parse_qs(parsed.query)
    if "sslmode" in query and query["sslmode"]:
        db_config["OPTIONS"] = {"sslmode": query["sslmode"][0]}

    return db_config

