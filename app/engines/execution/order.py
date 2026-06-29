from __future__ import annotations

from datetime import datetime, timezone
from pydantic import BaseModel, Field


class OrderRequest(BaseModel):
    symbol: str
    side: str
    quantity: float
    order_type: str = "market"
    limit_price: float | None = None
    stop_price: float | None = None
    timeframe: str = "15m"
    source: str = "manual"


class SimulatedOrder(BaseModel):
    order_id: str
    symbol: str
    side: str
    quantity: float
    order_type: str
    status: str
    requested_price: float | None = None
    fill_price: float | None = None
    commission: float = 0.0
    slippage: float = 0.0
    source: str = "manual"
    timeframe: str = "15m"
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    note: str = ""
