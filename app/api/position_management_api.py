from __future__ import annotations

from fastapi import APIRouter

from app.execution.position_management import position_management_engine
from app.execution.service import execution_service

router = APIRouter(prefix="/api/positions", tags=["positions"])


@router.get("/managed")
def managed_positions() -> dict:
    snapshot = execution_service.snapshot().model_dump()
    managed = position_management_engine.sync_from_snapshot(snapshot)
    return {"managed_positions": managed}


@router.post("/refresh")
def refresh_positions() -> dict:
    snapshot = execution_service.snapshot().model_dump()
    managed = position_management_engine.sync_from_snapshot(snapshot)
    return {"managed_positions": managed}


@router.post("/reset")
def reset_managed_positions() -> dict:
    position_management_engine.reset()
    return position_management_engine.snapshot()
