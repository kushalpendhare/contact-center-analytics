from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from sqlalchemy import text
import time

from .database import engine, SessionLocal
from .models import Base
from .routers.calls import router as calls_router


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

@app.get("/metrics")
def get_metrics():

    db = SessionLocal()

    try:

        uploaded = db.execute(
            text("SELECT COUNT(*) FROM calls WHERE status='UPLOADED'")
        ).scalar()

        processing = db.execute(
            text("SELECT COUNT(*) FROM calls WHERE status='PROCESSING'")
        ).scalar()

        completed = db.execute(
            text("SELECT COUNT(*) FROM calls WHERE status='COMPLETED'")
        ).scalar()

        failed = db.execute(
            text("SELECT COUNT(*) FROM calls WHERE status='FAILED'")
        ).scalar()

        total = db.execute(
            text("SELECT COUNT(*) FROM calls")
        ).scalar()

        return {
            "total": total,
            "uploaded": uploaded,
            "processing": processing,
            "completed": completed,
            "failed": failed,
        }

    finally:
        db.close()

@app.get("/transcripts")
def get_transcripts():

    db = SessionLocal()

    try:
        result = db.execute(
            text("""
                SELECT
                    c.id,
                    c.filename,
                    t.transcript,
                    t.sentiment,
                    t.summary
                FROM calls c
                JOIN transcripts t
                  ON c.id = t.call_id
                ORDER BY c.id DESC
            """)
        )

        rows = result.mappings().all()

        return [
            {
                "id": row["id"],
                "filename": row["filename"],
                "transcript": row["transcript"],
                "sentiment": row["sentiment"],
                "summary": row["summary"]
            }
            for row in rows
        ]

    finally:
        db.close()