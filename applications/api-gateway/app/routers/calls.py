from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

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
def create_call(call: CallCreate, db: Session = Depends(get_db)):
    call_record = Call(
        filename=call.filename,
        status="UPLOADED"
    )

    db.add(call_record)
    db.commit()
    db.refresh(call_record)

    return call_record


@router.get("/calls")
def get_calls(db: Session = Depends(get_db)):
    return db.query(Call).all()

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