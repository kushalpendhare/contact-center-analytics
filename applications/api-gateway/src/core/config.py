# src/core/config.py

import os


class Settings:

    DATABASE_HOST = os.getenv("DATABASE_HOST", "postgres")
    DATABASE_PORT = os.getenv("DATABASE_PORT", "5432")
    DATABASE_NAME = os.getenv("DATABASE_NAME", "contactcenter")
    DATABASE_USER = os.getenv("DATABASE_USER", "admin")
    DATABASE_PASSWORD = os.getenv("DATABASE_PASSWORD", "admin123")

    REDIS_HOST = os.getenv("REDIS_HOST", "redis")
    REDIS_PORT = os.getenv("REDIS_PORT", "6379")


settings = Settings()