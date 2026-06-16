# src/core/redis_client.py

import redis

from src.core.config import settings


redis_client = redis.Redis(
    host=settings.REDIS_HOST,
    port=int(settings.REDIS_PORT),
    decode_responses=True
)


def check_redis():

    try:
        redis_client.ping()
        return True

    except Exception:
        return False