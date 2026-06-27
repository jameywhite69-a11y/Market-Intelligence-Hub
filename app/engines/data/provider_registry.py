from app.models.market_data import MarketDataProviderConfig


class MarketDataProviderRegistry:
    def __init__(self):
        self.providers = {
            "demo": MarketDataProviderConfig(
                provider="demo",
                enabled=True,
                notes="Built-in simulated quotes and OHLCV data.",
            ),
            "csv": MarketDataProviderConfig(
                provider="csv",
                enabled=True,
                notes="Loads historical OHLCV from app/storage/imports CSV files.",
            ),
            "alpaca": MarketDataProviderConfig(
                provider="alpaca",
                enabled=False,
                base_url="https://data.alpaca.markets",
                notes="Adapter slot for Alpaca market data. Requires API keys.",
            ),
            "polygon": MarketDataProviderConfig(
                provider="polygon",
                enabled=False,
                base_url="https://api.polygon.io",
                notes="Adapter slot for Polygon.io. Requires API key.",
            ),
            "coinbase": MarketDataProviderConfig(
                provider="coinbase",
                enabled=False,
                base_url="https://api.exchange.coinbase.com",
                notes="Adapter slot for Coinbase public/advanced crypto data.",
            ),
        }

    def list(self) -> list[dict]:
        return [p.model_dump() for p in self.providers.values()]

    def get(self, provider: str) -> MarketDataProviderConfig | None:
        return self.providers.get(provider)

    def update(self, provider: str, updates: dict) -> dict:
        current = self.providers.get(provider)
        if not current:
            raise ValueError("Unknown provider")
        data = current.model_dump()
        data.update(updates)
        self.providers[provider] = MarketDataProviderConfig(**data)
        return self.providers[provider].model_dump()


provider_registry = MarketDataProviderRegistry()
