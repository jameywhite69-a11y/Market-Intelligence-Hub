from app.adapters.market_data.base import MarketDataAdapter


class NotConfiguredMarketDataAdapter(MarketDataAdapter):
    def __init__(self, provider: str):
        self.provider = provider

    def quote(self, symbol: str) -> dict:
        return {
            "symbol": symbol.upper(),
            "last": 0,
            "bid": 0,
            "ask": 0,
            "change": 0,
            "change_pct": 0,
            "volume": 0,
            "provider": self.provider,
            "status": "not_configured",
            "message": f"{self.provider} adapter requires API credentials/configuration.",
        }

    def historical(self, symbol: str, timeframe: str, bars: int = 120) -> dict:
        return {
            "symbol": symbol.upper(),
            "tf": timeframe,
            "bars": [],
            "provider": self.provider,
            "status": "not_configured",
            "message": f"{self.provider} historical adapter requires API credentials/configuration.",
        }


class AlpacaMarketDataAdapter(NotConfiguredMarketDataAdapter):
    def __init__(self):
        super().__init__("alpaca")


class PolygonMarketDataAdapter(NotConfiguredMarketDataAdapter):
    def __init__(self):
        super().__init__("polygon")


class CoinbaseMarketDataAdapter(NotConfiguredMarketDataAdapter):
    def __init__(self):
        super().__init__("coinbase")
