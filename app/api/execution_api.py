from __future__ import annotations

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.execution.models import ExecutionOrderRequest
from app.execution.service import execution_service


router = APIRouter(prefix="/api/execution", tags=["execution"])


class AdapterSelectionRequest(BaseModel):
    adapter: str


@router.get("/adapters")
def list_execution_adapters() -> dict:
    return {
        "active": execution_service.active_adapter_name,
        "available": execution_service.adapter_names(),
    }


@router.post("/adapter")
def set_execution_adapter(request: AdapterSelectionRequest) -> dict:
    try:
        snapshot = execution_service.set_active_adapter(request.adapter)
    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error)) from error

    return snapshot.model_dump()


@router.get("/snapshot")
def execution_snapshot() -> dict:
    return execution_service.snapshot().model_dump()


@router.post("/reset")
def reset_execution() -> dict:
    return execution_service.reset().model_dump()


@router.post("/orders")
def submit_execution_order(order: ExecutionOrderRequest) -> dict:
    response = execution_service.submit_order(order)
    return response.model_dump()
