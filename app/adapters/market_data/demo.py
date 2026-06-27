import math
import random
import time
from app.adapters.market_data.base import MarketDataAdapter


class DemoMarketDataAdapter(MarketDataAdapter):
    def quote(self, symbol: str) -> dict:
        seed = sum(ord(c) for c in symbol) + int(time.time() // 10)
        random.seed(seed)
        base = 100 + (sum(ord(c) for c in symbol) % 280)
        change = random.uniform(-2.2, 2.8)
        price = base + change
        return {
            "symbol": symbol.upper(),
            "last": round(price, 2),
            "bid": round(price - random.uniform(.01, .08), 2),
            "ask": round(price + random.uniform(.01, .08), 2),
            "change": round(change, 2),
            "change_pct": round(change / base * 100, 2),
            "volume": random.randint(800000, 60000000),
            "provider": "demo",
        }

    def historical(self, symbol: str, timeframe: str, bars: int = 120) -> dict:
        tf_mult = {"1m": 1, "3m": 1.3, "5m": 1.6, "15m": 2.2, "30m": 2.8, "1h": 3.6, "4h": 5.2, "1D": 8.0}.get(timeframe, 2)
        seed = sum(ord(c) for c in symbol) + int(time.time() // 30) + int(tf_mult * 100)
        random.seed(seed)
        start = 80 + (sum(ord(c) for c in symbol) % 260)
        ohlc = []
        price = start

        for i in range(bars):
            drift = math.sin(i / 9.0 + tf_mult) * 0.28 + random.uniform(-0.75, 0.85)
            openp = price
            closep = max(1, openp + drift)
            highp = max(openp, closep) + random.uniform(0.1, 1.1)
            lowp = min(openp, closep) - random.uniform(0.1, 1.1)
            vol = int(600000 + abs(drift) * 900000 + random.randint(0, 2000000))
            ohlc.append({"i": i, "time": int(time.time()) - (bars - i) * 60, "o": round(openp, 2), "h": round(highp, 2), "l": round(lowp, 2), "c": round(closep, 2), "v": vol})
            price = closep

        return {"symbol": symbol.upper(), "tf": timeframe, "bars": ohlc, "provider": "demo"}
