from fastapi import APIRouter
from app.models.strategy import StrategyDefinition
from app.services.strategy_builder import generate_strategy_code

router = APIRouter(prefix="/api/strategy-builder", tags=["strategy-builder"])


@router.post("/generate")
def generate_strategy(strategy: StrategyDefinition):
    return generate_strategy_code(strategy)
