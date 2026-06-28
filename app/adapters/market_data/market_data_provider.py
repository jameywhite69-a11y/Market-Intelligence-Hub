from __future__ import annotations

from abc import ABC, abstractmethod

from app.models.series import PriceSeries


class MarketDataProvider(ABC):
    """Base interface for all market data providers."""

    name: str = "base"

    @abstractmethod
    def get_series(
        self,
        *,
        symbol: str,
        timeframe: str,
        limit: int = 100,
    ) -> PriceSeries:
        raise NotImplementedError