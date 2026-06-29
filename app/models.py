from __future__ import annotations

from enum import Enum
from typing import Literal

from pydantic import BaseModel, Field, field_validator


class OrderSide(str, Enum):
    buy = "buy"
    sell = "sell"


class OrderType(str, Enum):
    market = "market"
    limit = "limit"
    stop = "stop"
    stop_limit = "stop_limit"


class ExecutionOrderRequest(BaseModel):
    symbol: str = Field(..., min_length=1)
    timeframe: str = "15m"
    side: OrderSide
    quantity: float = Field(..., gt=0)
    order_type: OrderType = OrderType.market
    entry_price: float | None = None
    stop_loss: float | None = None
    take_profit: float | None = None
    confidence: str | None = None
    expected_r: float | None = None
    allocation: float | None = None
    source: str = "paper"

    @field_validator("symbol")
    @classmethod
    def normalize_symbol(cls, value: str) -> str:
        return value.strip().upper()


class ExecutionOrderResponse(BaseModel):
    accepted: bool
    order_id: str
    broker: str = "paper"
    symbol: str
    side: str
    quantity: float
    order_type: str
    status: Literal["filled", "accepted", "rejected"]
    fill_price: float | None = None
    requested_price: float | None = None
    reason: str | None = None


class ExecutionSnapshot(BaseModel):
    broker: str
    mode: str
    equity: float
    cash: float
    buying_power: float
    realized_pnl: float
    unrealized_pnl: float
    open_pnl: float
    trade_count: int
    win_rate: float
    open_positions: list[dict]
    orders: list[dict]
