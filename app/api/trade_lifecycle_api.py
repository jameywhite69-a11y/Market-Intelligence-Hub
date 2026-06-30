from __future__ import annotations

from fastapi import APIRouter
from pydantic import BaseModel

from app.trade_lifecycle.engine import trade_lifecycle_engine

router = APIRouter(prefix="/api/trade-lifecycle", tags=["trade-lifecycle"])


class OpportunityLifecycleRequest(BaseModel):
    opportunity: dict
    source: str = "api"


class LifecycleSymbolRequest(BaseModel):
    symbol: str
    timeframe: str = "15m"
    source: str = "api"


@router.get("/snapshot")
def trade_lifecycle_snapshot() -> dict:
    return trade_lifecycle_engine.snapshot()


@router.post("/opportunity")
def update_lifecycle_from_opportunity(request: OpportunityLifecycleRequest) -> dict:
    return trade_lifecycle_engine.upsert_from_opportunity(request.opportunity, request.source)


@router.post("/entered")
def lifecycle_mark_entered(request: LifecycleSymbolRequest) -> dict:
    return trade_lifecycle_engine.mark_entered(request.symbol, request.timeframe, request.source)


@router.post("/partial-exit")
def lifecycle_mark_partial_exit(request: LifecycleSymbolRequest) -> dict:
    return trade_lifecycle_engine.mark_partial_exit(request.symbol, request.timeframe, request.source)


@router.post("/runner")
def lifecycle_mark_runner(request: LifecycleSymbolRequest) -> dict:
    return trade_lifecycle_engine.mark_runner(request.symbol, request.timeframe, request.source)


@router.post("/closed")
def lifecycle_mark_closed(request: LifecycleSymbolRequest) -> dict:
    return trade_lifecycle_engine.mark_closed(request.symbol, request.timeframe, request.source)


@router.post("/reset")
def trade_lifecycle_reset() -> dict:
    return trade_lifecycle_engine.reset()
