# src/routers/projects.py

from fastapi import APIRouter
from fastapi import Depends
from sqlalchemy.orm import Session

from src.core.database import get_db
from src.schemas.project import ProjectCreate
from src.schemas.project import ProjectResponse
from src.services.project_service import (
    create_project,
    get_projects,
    get_project
)

router = APIRouter(
    prefix="/projects",
    tags=["Projects"]
)


@router.post(
    "",
    response_model=ProjectResponse
)
def create_new_project(
    project: ProjectCreate,
    db: Session = Depends(get_db)
):
    return create_project(db, project)


@router.get(
    "",
    response_model=list[ProjectResponse]
)
def list_projects(
    db: Session = Depends(get_db)
):
    return get_projects(db)


@router.get(
    "/{project_id}",
    response_model=ProjectResponse
)
def get_single_project(
    project_id: int,
    db: Session = Depends(get_db)
):
    return get_project(db, project_id)