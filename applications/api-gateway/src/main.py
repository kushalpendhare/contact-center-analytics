from fastapi import FastAPI
from src.core.database import check_database
from src.core.redis_client import check_redis

app = FastAPI(
    title="Contact Center API Gateway",
    version="1.0.0"
)


@app.get("/")
def root():
    return {
        "project": "Contact Center Analytics Platform",
        "service": "API Gateway",
        "status": "running"
    }


@app.get("/health")
def health():

    db_status = check_database()
    redis_status = check_redis()
    
    overall = (
        db_status and redis_status
    )
    
    return {
        "status": "healthy" if overall else "unhealthy",
        "database": "healthy" if db_status else "unhealthy",
        "redis": "healthy" if redis_status else "unhealthy"
    }