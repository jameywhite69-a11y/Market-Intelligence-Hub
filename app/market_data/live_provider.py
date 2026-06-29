from __future__ import annotations

import math
import random
from datetime import datetime

from app.market_data.live_models import MarketDataSnapshot, MarketQuote


class DemoLiveMarketDataProvider:
    name = "demo"
    mode = "simulated"

    def __init__(self) -> None:
        self.base_prices = {
            "BTC": 199.0,
            "ETH": 199.0,
            "SOL": 199.0,
            "AAPL": 199.0,
            "MSFT": 199.0,
            "TSLA": 199.0,
        }
        self.tick = 0

    def quote(self, symbol: str) -> MarketQuote:
        symbol = symbol.upper().strip()
        base = self.base_prices.get(symbol, 199.0)

        self.tick += 1
        drift = math.sin(self.tick / 8) * 1.15
        noise = random.uniform(-0.35, 0.35)
        price = round(max(0.01, base + drift + noise), 4)

        self.base_prices[symbol] = price

        spread = round(max(0.01, price * 0.0006), 4)
        bid = round(price - spread / 2, 4)
        ask = round(price + spread / 2, 4)
        change = round(price - base, 4)
        change_percent = round((change / base) * 100, 4) if base else 0.0

        return MarketQuote(
            symbol=symbol,
            price=price,
            bid=bid,
            ask=ask,
            spread=spread,
            volume=round(random.uniform(1000, 25000), 2),
            change=change,
            change_percent=change_percent,
            provider=self.name,
        )

    def snapshot(self, symbols: list[str]) -> MarketDataSnapshot:
        clean = [symbol.upper().strip() for symbol in symbols if symbol.strip()]
        quotes = {symbol: self.quote(symbol) for symbol in clean}

        return MarketDataSnapshot(
            provider=self.name,
            mode=self.mode,
            symbols=clean,
            quotes=quotes,
            last_update=datetime.utcnow().isoformat(),
        )


live_market_data_provider = DemoLiveMarketDataProvider()
