from __future__ import annotations

from app.adapters.market_data.demo_provider import DemoMarketDataProvider
from app.adapters.market_data.market_data_provider import MarketDataProvider


class MarketDataProviderRegistry:
    """Registry for market data providers."""

    def __init__(self) -> None:
        self._providers: dict[str, MarketDataProvider] = {}

    def register(self, provider: MarketDataProvider, *, replace: bool = False) -> None:
        key = provider.name.strip().lower()

        if key in self._providers and not replace:
            raise ValueError(f"Market data provider already registered: {key}")

        self._providers[key] = provider

    def get(self, name: str) -> MarketDataProvider:
        key = name.strip().lower()

        if key not in self._providers:
            raise KeyError(f"Market data provider not registered: {key}")

        return self._providers[key]

    def names(self) -> list[str]:
        return sorted(self._providers.keys())

    def clear(self) -> None:
        self._providers.clear()


market_data_provider_registry = MarketDataProviderRegistry()
market_data_provider_registry.register(DemoMarketDataProvider())