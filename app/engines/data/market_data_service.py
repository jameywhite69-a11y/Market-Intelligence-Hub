from app.adapters.market_data.demo import DemoMarketDataAdapter
from app.adapters.market_data.csv_adapter import CsvMarketDataAdapter
from app.adapters.market_data.http_placeholders import AlpacaMarketDataAdapter, PolygonMarketDataAdapter, CoinbaseMarketDataAdapter
from app.core.settings import settings_manager
from app.core.audit import log_action


class MarketDataService:
    def __init__(self):
        self.adapters = {
            "demo": DemoMarketDataAdapter(),
            "csv": CsvMarketDataAdapter(),
            "alpaca": AlpacaMarketDataAdapter(),
            "polygon": PolygonMarketDataAdapter(),
            "coinbase": CoinbaseMarketDataAdapter(),
        }

    def active_provider(self) -> str:
        settings = settings_manager.load()
        return settings.get("market_data_provider", "demo")

    def set_provider(self, provider: str) -> dict:
        if provider not in self.adapters:
            raise ValueError(f"Unknown market data provider: {provider}")
        settings = settings_manager.update({"market_data_provider": provider})
        log_action("market_data.provider_switch", {"provider": provider})
        return settings

    def adapter(self):
        return self.adapters.get(self.active_provider(), self.adapters["demo"])

    def quote(self, symbol: str) -> dict:
        result = self.adapter().quote(symbol)
        if result.get("status") in {"not_configured", "file_not_found", "no_csv_data"} and self.active_provider() != "demo":
            fallback = self.adapters["demo"].quote(symbol)
            fallback["provider"] = "demo_fallback"
            fallback["fallback_reason"] = result.get("status")
            return fallback
        return result

    def historical(self, symbol: str, timeframe: str, bars: int = 120) -> dict:
        result = self.adapter().historical(symbol, timeframe, bars)
        if result.get("status") in {"not_configured", "file_not_found", "no_csv_data"} and self.active_provider() != "demo":
            fallback = self.adapters["demo"].historical(symbol, timeframe, bars)
            fallback["provider"] = "demo_fallback"
            fallback["fallback_reason"] = result.get("status")
            return fallback
        return result


market_data_service = MarketDataService()
