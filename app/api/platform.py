from fastapi import APIRouter
from app.core.event_bus import event_bus
from app.core.plugin_manager import plugin_manager
from app.core.settings import settings_manager
from app.core.workspace_manager import workspace_manager
from app.core.service_registry import service_registry
from app.core.audit import list_audit, log_action

router = APIRouter(prefix="/api/platform", tags=["platform"])


@router.get("/status")
def status():
    return {
        "version": "23.1",
        "architecture": "enterprise-real-market-data-layer",
        "settings": settings_manager.load(),
        "workspaces": workspace_manager.list_workspaces(),
        "plugins": plugin_manager.list_plugins(),
        "health": service_registry.health(),
    }


@router.get("/events")
def events(limit: int = 50):
    return [event.__dict__ for event in event_bus.history(limit)]


@router.get("/plugins")
def plugins():
    return plugin_manager.list_plugins()


@router.get("/workspaces")
def workspaces():
    return workspace_manager.list_workspaces()


@router.get("/settings")
def get_settings():
    return settings_manager.load()


@router.post("/settings")
def update_settings(updates: dict):
    return settings_manager.update(updates)


@router.get("/health")
def health():
    return service_registry.health()


@router.get("/audit")
def audit(limit: int = 100):
    return list_audit(limit)


@router.post("/audit")
def audit_write(payload: dict):
    return log_action(payload.get("action", "manual.audit"), payload.get("payload", {}))
