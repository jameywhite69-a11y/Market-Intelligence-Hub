from app.core.persistence import state_store

DEFAULT_STATE = {
    "selected_symbol": "NVDA",
    "selected_strategy": "EMA Pullback",
    "active_watchlist": "Tech",
    "layout": "4 Chart",
    "chart_engine": "Lightweight Charts",
    "broker_mode": "Paper",
    "current_workspace": "trading",
    "dock_mode": "normal",
    "watchlists": {
        "Tech": ["NVDA", "AMD", "AAPL", "MSFT", "META", "GOOGL", "PLTR"],
        "Crypto": ["BTCUSD", "ETHUSD", "SOLUSD", "LINKUSD", "AVAXUSD", "AAVEUSD"],
        "Futures": ["ES1!", "NQ1!", "YM1!", "RTY1!"],
    },
    "chart_settings": [
        {"tf": "1m", "type": "candles", "ema20": True, "ema50": True, "ema200": False, "vwap": True, "volume": True},
        {"tf": "5m", "type": "candles", "ema20": True, "ema50": True, "ema200": False, "vwap": True, "volume": True},
        {"tf": "15m", "type": "candles", "ema20": True, "ema50": True, "ema200": True, "vwap": False, "volume": True},
        {"tf": "1h", "type": "candles", "ema20": True, "ema50": True, "ema200": True, "vwap": False, "volume": True},
    ],
    "alerts": [],
    "positions": [],
    "orders": [],
    "journal": [],
    "staged_trades": [],
    "risk": {"account": 300000, "risk_pct": 1.0, "daily_loss_limit": 3000, "max_open_risk": 9000},
}


def load_state() -> dict:
    return state_store.read(DEFAULT_STATE)


def save_state(state: dict) -> None:
    state_store.write(state)
