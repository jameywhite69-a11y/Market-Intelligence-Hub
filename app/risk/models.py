from __future__ import annotations

from enum import Enum
from pydantic import BaseModel, Field


class RiskDecision(str, Enum):
    approved = "Approved"
    caution = "Caution"
    rejected = "Rejected"


class RiskCheck(BaseModel):
    name: str
    status: str
    value: float | str
    limit: float | str | None = None
    message: str


class RiskAssessment(BaseModel):
    symbol: str
    timeframe: str = "15m"
    decision: RiskDecision
    portfolio_heat_before: float
    portfolio_heat_after: float
    daily_risk_budget: float
    daily_risk_used: float
    daily_risk_remaining: float
    proposed_risk: float
    recommended_quantity: float
    recommended_notional: float
    expected_r: float
    checks: list[RiskCheck] = Field(default_factory=list)
    warnings: list[str] = Field(default_factory=list)
    rejection_reasons: list[str] = Field(default_factory=list)
