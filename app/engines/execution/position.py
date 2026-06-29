from __future__ import annotations

from pydantic import BaseModel


class Position(BaseModel):
    symbol: str
    quantity: float
    average_price: float
    market_price: float
    unrealized_pnl: float
    realized_pnl: float = 0.0
    side: str = "long"
