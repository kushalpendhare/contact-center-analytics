# src/routers/projects.py

from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException
from sqlalchemy.orm import Session

from src.core.database import get_db
from src.schemas.project import ProjectCreate
from src.schemas.project import ProjectResponse
from src.schemas.project import ProjectUpdate
from src.services.project_service import (
    create_project,
    delete_project,
    get_projects,
    get_project,
    update_project
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
    project = get_project(db, project_id)

    if project is None:
        raise HTTPException(status_code=404, detail="Project not found")

    return project


@router.put(
    "/{project_id}",
    response_model=ProjectResponse
)
def update_existing_project(
    project_id: int,
    project: ProjectUpdate,
    db: Session = Depends(get_db)
):
    updated_project = update_project(db, project_id, project)

    if updated_project is None:
        raise HTTPException(status_code=404, detail="Project not found")

    return updated_project


@router.delete(
    "/{project_id}",
    response_model=ProjectResponse
)
def delete_existing_project(
    project_id: int,
    db: Session = Depends(get_db)
):
    deleted_project = delete_project(db, project_id)

    if deleted_project is None:
        raise HTTPException(status_code=404, detail="Project not found")

    return deleted_project
