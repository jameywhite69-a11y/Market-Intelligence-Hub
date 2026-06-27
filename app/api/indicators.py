from fastapi import APIRouter
from app.engines.indicators.indicator_engine import engine
router=APIRouter(prefix="/api/indicators",tags=["indicators"])
@router.get("/library")
def lib(): return engine.library()
