from __future__ import annotations

from pydantic import BaseModel, Field
from datetime import datetime


class MarketQuote(BaseModel):
    symbol: str
    price: float
    bid: float
    ask: float
    spread: float
    volume: float = 0.0
    change: float = 0.0
    change_percent: float = 0.0
    provider: str = "demo"
    timestamp: str = Field(default_factory=lambda: datetime.utcnow().isoformat())


class MarketDataSnapshot(BaseModel):
    provider: str
    mode: str
    symbols: list[str]
    quotes: dict[str, MarketQuote]
    last_update: str = Field(default_factory=lambda: datetime.utcnow().isoformat())
