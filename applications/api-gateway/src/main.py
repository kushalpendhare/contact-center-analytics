from fastapi import FastAPI
from src.core.database import check_database
from src.core.redis_client import check_redis
from src.routers.dashboard import router as dashboard_router
from src.routers.projects import router as projects_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="Contact Center API Gateway",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(dashboard_router)
app.include_router(projects_router)


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
