import json

from sqlalchemy.orm import Session

from src.core.redis_client import redis_client
from src.models.project import Project


CACHE_KEY = "dashboard:summary"
CACHE_SECONDS = 30


def invalidate_dashboard_cache():

    try:
        redis_client.delete(CACHE_KEY)
    except Exception:
        pass


def get_dashboard_summary(db: Session):

    cached_summary = None

    try:
        cached_summary = redis_client.get(CACHE_KEY)
    except Exception:
        cached_summary = None

    if cached_summary is not None:
        summary = json.loads(cached_summary)
        summary["cached"] = True
        return summary

    projects = db.query(Project).order_by(Project.id.desc()).all()

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
                "customer": project.customer
            }
            for project in projects[:5]
        ],
        "cached": False
    }

    try:
        redis_client.setex(CACHE_KEY, CACHE_SECONDS, json.dumps(summary))
    except Exception:
        pass

    return summary
