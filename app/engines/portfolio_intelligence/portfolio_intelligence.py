from __future__ import annotations

from pydantic import BaseModel


class PortfolioExposure(BaseModel):
    asset_class: str
    exposure_percent: float
    note: str


class PortfolioIntelligence(BaseModel):
    symbol: str
    timeframe: str
    portfolio_heat: float
    risk_budget_remaining: float
    correlation_risk: str
    exposure_risk: str
    recommended_position_size: str
    portfolio_action: str
    portfolio_fit_score: float
    exposures: list[PortfolioExposure]
    warnings: list[str]
    narrative: str
