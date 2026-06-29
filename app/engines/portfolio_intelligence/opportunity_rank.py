from __future__ import annotations

from pydantic import BaseModel


class RankedOpportunity(BaseModel):
    rank: int
    symbol: str
    timeframe: str
    opportunity_score: float
    decision_score: float
    confidence_score: float
    strategy_score: float
    expected_r: float
    allocation_percent: float
    momentum: str
    classification: str
    recommendation: str


class OpportunityPortfolioSnapshot(BaseModel):
    top_opportunity: RankedOpportunity | None
    highest_confidence: RankedOpportunity | None
    best_risk_reward: RankedOpportunity | None
    largest_allocation: RankedOpportunity | None
    ranked_opportunities: list[RankedOpportunity]
