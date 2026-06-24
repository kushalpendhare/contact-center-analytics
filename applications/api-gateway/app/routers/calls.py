from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text

from ..database import SessionLocal
from ..models import Call
from ..schemas import CallCreate, CallResponse
from fastapi import UploadFile, File
import os
from ..s3_client import s3, BUCKET_NAME

router = APIRouter()

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/calls", response_model=CallResponse)
def create_call(
    call: CallCreate,
    db: Session = Depends(get_db)
):
    call_record = Call(
        filename=call.filename,
        status="UPLOADED"
    )

    db.add(call_record)
    db.commit()
    db.refresh(call_record)

    return call_record


@router.get("/calls")
def get_calls(
    db: Session = Depends(get_db)
):
    return (
        db.query(Call)
        .order_by(Call.id.desc())
        .all()
    )


@router.get("/calls/{call_id}")
def get_call(
    call_id: int,
    db: Session = Depends(get_db)
):
    call = (
        db.query(Call)
        .filter(Call.id == call_id)
        .first()
    )

    if not call:
        return {
            "error": "Call not found"
        }

    return call


@router.get("/transcripts/{call_id}")
def get_transcript(
    call_id: int,
    db: Session = Depends(get_db)
):
    result = db.execute(
        text(
            """
            SELECT
                t.id,
                t.call_id,
                t.transcript,
                t.sentiment,
                t.summary,
                t.created_at
            FROM transcripts t
            WHERE t.call_id = :call_id
            """
        ),
        {"call_id": call_id}
    )

    row = result.mappings().first()

    if not row:
        return None

    return {
        "id": row["id"],
        "call_id": row["call_id"],
        "transcript": row["transcript"],
        "sentiment": row["sentiment"],
        "summary": row["summary"],
        "created_at": row["created_at"]
    }


@router.post("/upload")
async def upload_call(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    contents = await file.read()

    s3.put_object(
        Bucket=BUCKET_NAME,
        Key=file.filename,
        Body=contents
    )

    call_record = Call(
        filename=file.filename,
        filepath=f"s3://{BUCKET_NAME}/{file.filename}",
        status="UPLOADED"
    )

    db.add(call_record)
    db.commit()
    db.refresh(call_record)

    return {
        "filename": file.filename,
        "message": "Uploaded to MinIO"
    }