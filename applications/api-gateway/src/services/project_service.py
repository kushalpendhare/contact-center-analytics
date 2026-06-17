# src/services/project_service.py

from sqlalchemy.orm import Session

from src.models.project import Project
from src.models.user import User
from src.schemas.project import ProjectCreate
from src.schemas.project import ProjectUpdate
from src.services.dashboard_service import invalidate_dashboard_cache


def create_project(db: Session, project: ProjectCreate, current_user: User):

    db_project = Project(
        name=project.name,
        platform=project.platform,
        customer=project.customer,
        tenant_id=current_user.tenant_id
    )

    db.add(db_project)
    db.commit()
    db.refresh(db_project)
    invalidate_dashboard_cache(current_user.tenant_id)

    return db_project


def get_projects(db: Session, current_user: User):

    return (
        db.query(Project)
        .filter(Project.tenant_id == current_user.tenant_id)
        .order_by(Project.id.desc())
        .all()
    )


def get_project(db: Session, project_id: int, current_user: User):

    return (
        db.query(Project)
        .filter(Project.id == project_id)
        .filter(Project.tenant_id == current_user.tenant_id)
        .first()
    )


def update_project(db: Session, project_id: int, project: ProjectUpdate, current_user: User):

    db_project = get_project(db, project_id, current_user)

    if db_project is None:
        return None

    db_project.name = project.name
    db_project.platform = project.platform
    db_project.customer = project.customer

    db.commit()
    db.refresh(db_project)
    invalidate_dashboard_cache(current_user.tenant_id)

    return db_project


def delete_project(db: Session, project_id: int, current_user: User):

    db_project = get_project(db, project_id, current_user)

    if db_project is None:
        return None

    db.delete(db_project)
    db.commit()
    invalidate_dashboard_cache(current_user.tenant_id)

    return db_project
