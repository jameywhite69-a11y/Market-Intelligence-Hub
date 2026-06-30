from __future__ import annotations
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.strategy_execution.engine import strategy_execution_engine
from app.strategy_execution.models import ExecutionPlan
from app.strategy_execution.registry import strategy_registry

router = APIRouter(prefix="/api/strategy-execution", tags=["strategy-execution"])

class OpportunityRequest(BaseModel):
    opportunity: dict

class PlanExecutionRequest(BaseModel):
    plan: dict

@router.get("/strategies")
def list_strategies() -> dict:
    return {"strategies": strategy_registry.list_strategies()}

@router.post("/plan")
def build_execution_plan(request: OpportunityRequest) -> dict:
    return strategy_execution_engine.plan_from_opportunity(request.opportunity)

@router.post("/execute")
def execute_plan(request: PlanExecutionRequest) -> dict:
    try:
        plan = ExecutionPlan(**request.plan)
    except Exception as error:
        raise HTTPException(status_code=400, detail=str(error)) from error
    return strategy_execution_engine.execute_plan(plan)
