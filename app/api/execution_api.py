from __future__ import annotations

from fastapi import APIRouter, HTTPException

from app.adapters.market_data.demo_provider import DemoMarketDataProvider
from app.engines.execution.execution_engine import execution_engine
from app.engines.execution.order import OrderRequest

router = APIRouter(prefix="/api/execution", tags=["execution"])


@router.get("/snapshot")
def get_execution_snapshot() -> dict:
    return execution_engine.snapshot().model_dump()


@router.post("/orders")
def submit_order(request: OrderRequest) -> dict:
    provider = DemoMarketDataProvider()

    try:
        series = provider.get_series(symbol=request.symbol.upper(), timeframe=request.timeframe, limit=5)
        market_price = series.candles[-1].close
        order = execution_engine.submit_order(request, market_price)
    except Exception as error:
        raise HTTPException(status_code=400, detail=str(error)) from error

    return order.model_dump()


@router.post("/reset")
def reset_execution() -> dict:
    return execution_engine.reset().model_dump()
