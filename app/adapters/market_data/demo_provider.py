from __future__ import annotations

from app.adapters.market_data.market_data_provider import MarketDataProvider
from app.models.series import PriceSeries


class DemoMarketDataProvider(MarketDataProvider):
    """Demo-safe market data provider for scanner development."""

    name: str = "demo"

    def get_series(
        self,
        *,
        symbol: str,
        timeframe: str,
        limit: int = 100,
    ) -> PriceSeries:
        count = max(1, limit)

        close = [float(100 + index) for index in range(count)]

        return PriceSeries(
            symbol=symbol.strip().upper(),
            timeframe=timeframe.strip(),
            open=[value - 0.5 for value in close],
            high=[value + 1.0 for value in close],
            low=[value - 1.0 for value in close],
            close=close,
            volume=[1000.0 for _ in close],
        )