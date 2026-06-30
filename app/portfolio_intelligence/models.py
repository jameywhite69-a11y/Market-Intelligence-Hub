from __future__ import annotations

from pydantic import BaseModel, Field


class ExposureBucket(BaseModel):
    name: str
    notional: float
    percent: float


class PortfolioIntelligenceSnapshot(BaseModel):
    equity: float
    cash: float
    buying_power: float
    open_pnl: float
    realized_pnl: float
    open_positions: int
    open_risk: float
    portfolio_heat_percent: float
    daily_risk_budget: float
    daily_risk_used: float
    daily_risk_remaining: float
    exposure: list[ExposureBucket] = Field(default_factory=list)
    warnings: list[str] = Field(default_factory=list)
    recommendation: str
