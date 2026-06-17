import json

from sqlalchemy.orm import Session

from src.core.redis_client import redis_client
from src.models.project import Project
from src.models.user import User


CACHE_KEY_PREFIX = "dashboard:summary"
CACHE_SECONDS = 30


def _cache_key(tenant_id: int):
    return f"{CACHE_KEY_PREFIX}:{tenant_id}"


def invalidate_dashboard_cache(tenant_id: int):

    try:
        redis_client.delete(_cache_key(tenant_id))
    except Exception:
        pass


def get_dashboard_summary(db: Session, current_user: User):

    cached_summary = None
    cache_key = _cache_key(current_user.tenant_id)

    try:
        cached_summary = redis_client.get(cache_key)
    except Exception:
        cached_summary = None

    if cached_summary is not None:
        summary = json.loads(cached_summary)
        summary["cached"] = True
        return summary

    projects = (
        db.query(Project)
        .filter(Project.tenant_id == current_user.tenant_id)
        .order_by(Project.id.desc())
        .all()
    )

    platform_counts = {}
    for project in projects:
        platform_counts[project.platform] = platform_counts.get(project.platform, 0) + 1

    summary = {
        "project_count": len(projects),
        "platform_counts": platform_counts,
        "recent_projects": [
            {
                "id": project.id,
                "name": project.name,
                "platform": project.platform,
                "customer": project.customer,
                "tenant_id": project.tenant_id
            }
            for project in projects[:5]
        ],
        "cached": False
    }

    try:
        redis_client.setex(cache_key, CACHE_SECONDS, json.dumps(summary))
    except Exception:
        pass

    return summary
