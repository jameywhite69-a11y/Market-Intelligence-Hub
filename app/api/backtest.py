from fastapi import APIRouter
from pydantic import BaseModel
from app.models.rule import StrategyRuleGraph
from app.engines.backtest.backtest_engine import backtest_engine
from app.core.audit import log_action

router = APIRouter(prefix="/api/backtest", tags=["backtest"])


class BacktestRequest(BaseModel):
    graph: StrategyRuleGraph
    symbol: str
    timeframe: str = "15m"
    bars: int = 240
    initial_capital: float = 10000


@router.post("/run")
def run_backtest(request: BacktestRequest):
    result = backtest_engine.run(
        graph=request.graph,
        symbol=request.symbol,
        timeframe=request.timeframe,
        bars=request.bars,
        initial_capital=request.initial_capital,
    )
    log_action("backtest.run", {
        "symbol": request.symbol,
        "strategy": request.graph.name,
        "trades": result["trade_count"],
        "net_pnl": result["net_pnl"],
    })
    return result
