from __future__ import annotations

from typing import Protocol

from app.models.series import PriceSeries


class MarketDataProvider(Protocol):
    def get_series(self, symbol: str, timeframe: str) -> PriceSeries:
        ...