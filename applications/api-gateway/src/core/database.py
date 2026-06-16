# src/core/database.py

from sqlalchemy import create_engine
from sqlalchemy import text

from src.core.config import settings


DATABASE_URL = (
    f"postgresql://"
    f"{settings.DATABASE_USER}:"
    f"{settings.DATABASE_PASSWORD}@"
    f"{settings.DATABASE_HOST}:"
    f"{settings.DATABASE_PORT}/"
    f"{settings.DATABASE_NAME}"
)

engine = create_engine(DATABASE_URL)


def check_database():

    try:
        with engine.connect() as connection:
            connection.execute(text("SELECT 1"))

        return True

    except Exception:
        return False