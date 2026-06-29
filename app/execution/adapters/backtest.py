from __future__ import annotations

from app.execution.adapters.paper import PaperBrokerAdapter


class BacktestBrokerAdapter(PaperBrokerAdapter):
    name = "backtest"
    mode = "historical"
