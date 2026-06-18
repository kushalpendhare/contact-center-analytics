from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from .database import engine
from .models import Base
from .routers.calls import router as calls_router
import time

@asynccontextmanager
async def lifespan(app: FastAPI):
    for _ in range(10):
        try:
            Base.metadata.create_all(bind=engine)
            break
        except Exception:
            time.sleep(3)

    yield

app = FastAPI(
    title="Contact Center Analytics API",
    lifespan=lifespan
)

#Base.metadata.create_all(bind=engine)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(calls_router)


@app.get("/")
def root():
    return {"status": "running"}


@app.get("/health")
def health():
    return {"health": "ok"}