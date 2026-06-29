from __future__ import annotations

from fastapi import APIRouter

from app.execution.position_management import position_management_engine
from app.execution.position_lifecycle import position_lifecycle_engine
from app.execution.portfolio_risk import portfolio_risk_engine
from app.execution.service import execution_service

router = APIRouter(prefix="/api/positions", tags=["positions"])


@router.get("/managed")
def managed_positions() -> dict:
    snapshot = execution_service.snapshot().model_dump()
    managed = position_management_engine.sync_from_snapshot(snapshot)

    for position in managed:
        position_lifecycle_engine.sync_position(
            symbol=position["symbol"],
            r_multiple=float(position.get("r_multiple", 0.0)),
            has_stop=bool(position.get("stop_loss")),
        )

    return {
        "managed_positions": managed,
        "lifecycle": position_lifecycle_engine.snapshot(),
        "portfolio_risk": portfolio_risk_engine.calculate(snapshot, managed),
    }


@router.post("/refresh")
def refresh_positions() -> dict:
    return managed_positions()


@router.post("/reset")
def reset_managed_positions() -> dict:
    position_management_engine.reset()
    return position_management_engine.snapshot()


@router.get("/lifecycle")
def position_lifecycle() -> dict:
    return position_lifecycle_engine.snapshot()


@router.get("/portfolio-risk")
def portfolio_risk() -> dict:
    snapshot = execution_service.snapshot().model_dump()
    managed = position_management_engine.sync_from_snapshot(snapshot)
    return portfolio_risk_engine.calculate(snapshot, managed)
