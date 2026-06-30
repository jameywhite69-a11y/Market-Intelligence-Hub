from __future__ import annotations
from enum import Enum
from pydantic import BaseModel, Field

class SignalAction(str, Enum):
    buy = "buy"
    sell = "sell"
    hold = "hold"
    exit = "exit"

class PlanStatus(str, Enum):
    approved = "approved"
    rejected = "rejected"
    watch = "watch"

class StrategySignal(BaseModel):
    strategy_id: str
    symbol: str
    timeframe: str
    action: SignalAction
    confidence: float
    score: float
    rationale: list[str] = Field(default_factory=list)
    entry_price: float | None = None
    stop_loss: float | None = None
    target_1: float | None = None
    target_2: float | None = None

class ExecutionPlan(BaseModel):
    plan_id: str
    strategy_id: str
    symbol: str
    timeframe: str
    action: SignalAction
    status: PlanStatus
    quantity: float
    entry_price: float
    stop_loss: float
    target_1: float
    target_2: float
    dollar_risk: float
    expected_r: float
    notional: float
    rationale: list[str] = Field(default_factory=list)
    rejection_reasons: list[str] = Field(default_factory=list)

class StrategyDefinition(BaseModel):
    strategy_id: str
    name: str
    description: str
    min_score: float = 70.0
    min_confidence: float = 60.0
    risk_percent: float = 1.0
    enabled: bool = True
