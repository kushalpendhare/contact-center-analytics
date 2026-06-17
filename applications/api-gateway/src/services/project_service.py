# src/services/project_service.py

from sqlalchemy.orm import Session

from src.models.project import Project
from src.schemas.project import ProjectCreate


def create_project(db: Session, project: ProjectCreate):

    db_project = Project(
        name=project.name,
        platform=project.platform,
        customer=project.customer
    )

    db.add(db_project)
    db.commit()
    db.refresh(db_project)

    return db_project


def get_projects(db: Session):

    return db.query(Project).all()


def get_project(db: Session, project_id: int):

    return (
        db.query(Project)
        .filter(Project.id == project_id)
        .first()
    )