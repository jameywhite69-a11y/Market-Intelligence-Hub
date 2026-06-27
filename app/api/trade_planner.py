from fastapi import APIRouter
from pydantic import BaseModel
from app.models.rule import StrategyRuleGraph
from app.services.trade_planner import build_trade_plan, build_trade_queue, portfolio_exposure

router = APIRouter(prefix="/api/trade-planner", tags=["trade-planner"])


class TradePlanRequest(BaseModel):
    graph: StrategyRuleGraph
    symbol: str
    account: float = 300000
    risk_pct: float = 1.0
    price: float | None = None


class TradeQueueRequest(BaseModel):
    graph: StrategyRuleGraph
    symbols: list[str]
    account: float = 300000
    risk_pct: float = 1.0


class ExposureRequest(BaseModel):
    positions: list[dict]


@router.post("/plan")
def plan(request: TradePlanRequest):
    return build_trade_plan(request.graph, request.symbol, request.account, request.risk_pct, request.price)


@router.post("/queue")
def queue(request: TradeQueueRequest):
    return build_trade_queue(request.graph, request.symbols, request.account, request.risk_pct)


@router.post("/exposure")
def exposure(request: ExposureRequest):
    return portfolio_exposure(request.positions)
