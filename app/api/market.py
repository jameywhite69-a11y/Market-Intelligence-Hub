import random
from fastapi import APIRouter
from app.engines.data.market_data_service import market_data_service

router = APIRouter(prefix="/api", tags=["market"])


@router.get("/market/{symbol}")
def market(symbol: str):
    q = market_data_service.quote(symbol)
    q["confidence"] = random.randint(72, 98)
    return q


@router.get("/chart/{symbol}/{tf}")
def chart(symbol: str, tf: str, bars: int = 120):
    return market_data_service.historical(symbol, tf, bars)


@router.get("/smart")
def smart():
    syms = ["NVDA", "AMD", "PLTR", "COIN", "TSLA", "META", "MSFT", "AAPL", "BTCUSD", "ETHUSD", "SOLUSD", "AVAXUSD"]
    out = []
    for i, s in enumerate(syms):
        score = max(62, 98 - i * 3 + random.randint(-2, 2))
        out.append({"symbol": s, "score": score, "trend": "Bull" if score > 78 else "Neutral", "rvol": round(random.uniform(1.2, 4.8), 2)})
    return out


@router.get("/strategy/{symbol}/{strategy}")
def strategy(symbol: str, strategy: str):
    rules = {
        "EMA Pullback": ["EMA20 > EMA50", "ADX trend active", "Pullback held", "Reclaim candle", "Volume confirmation", "Higher low"],
        "Momentum Breakout": ["New session high", "RVOL > 2.0", "Tight base", "EMA alignment", "Range expansion", "Institutional flow"],
        "VWAP Reversal": ["VWAP reclaim", "RSI recovery", "Volume expansion", "Failed breakdown", "Trend confirmation", "Risk defined"],
        "Mean Reversion": ["Extended move", "RSI extreme", "Volume climax", "Support/resistance", "Reversal candle", "Reward room"],
    }.get(strategy, ["Trend", "Volume", "Momentum", "Risk"])
    random.seed(sum(ord(c) for c in symbol + strategy))
    return [{"rule": r, "passed": random.random() > .25, "score": random.randint(70, 99)} for r in rules]


@router.get("/brokers")
def brokers():
    return [
        {"name": "Paper Trading", "status": "Connected", "mode": "Simulated"},
        {"name": "Alpaca", "status": "Adapter slot ready", "mode": "Stocks/Crypto"},
        {"name": "Interactive Brokers", "status": "Adapter slot ready", "mode": "Stocks/Options/Futures"},
        {"name": "TradeStation", "status": "Adapter slot ready", "mode": "Stocks/Options/Futures"},
        {"name": "Coinbase Advanced", "status": "Adapter slot ready", "mode": "Crypto"},
    ]
