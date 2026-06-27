from datetime import datetime
from typing import Any
from app.core.persistence import audit_store


def log_action(action: str, payload: dict[str, Any] | None = None) -> dict:
    event = {
        "timestamp": datetime.utcnow().isoformat(),
        "action": action,
        "payload": payload or {},
    }
    audit_store.append(event)
    return event


def list_audit(limit: int = 100) -> list[dict]:
    return audit_store.read([])[:limit]
