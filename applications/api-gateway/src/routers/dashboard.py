from fastapi import APIRouter
from fastapi import Depends
from sqlalchemy.orm import Session

from src.core.database import get_db
from src.services.dashboard_service import get_dashboard_summary


router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"]
)


@router.get("/summary")
def dashboard_summary(
    db: Session = Depends(get_db)
):
    return get_dashboard_summary(db)
