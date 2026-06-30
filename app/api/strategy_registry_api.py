from __future__ import annotations
from fastapi import APIRouter
from app.research.strategy_registry.service import strategy_registry_service

router = APIRouter(prefix="/api/research/strategies", tags=["research-strategies"])

@router.get("")
def list_research_strategies() -> dict:
    return strategy_registry_service.list_strategies()

@router.get("/health")
def strategy_registry_health() -> dict:
    return strategy_registry_service.health_summary()

@router.get("/{strategy_id}")
def get_research_strategy(strategy_id: str) -> dict:
    return strategy_registry_service.get_strategy(strategy_id)
