from __future__ import annotations

from fastapi import APIRouter

from app.portfolio_intelligence.engine import portfolio_intelligence_engine

router = APIRouter(prefix="/api/portfolio-intelligence", tags=["portfolio-intelligence"])


@router.get("/snapshot")
def portfolio_intelligence_snapshot() -> dict:
    return portfolio_intelligence_engine.snapshot()
