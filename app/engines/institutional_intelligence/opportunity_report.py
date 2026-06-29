from __future__ import annotations

from pydantic import BaseModel


class OpportunityLevel(BaseModel):
    label: str
    value: float
    note: str


class OpportunityRisk(BaseModel):
    risk_level: str
    risk_score: float
    liquidity_note: str
    volatility_note: str
    execution_note: str


class OpportunityNarrative(BaseModel):
    summary: str
    bullish_case: list[str]
    bearish_case: list[str]
    trade_plan_summary: str
    decision_note: str


class OpportunityIntelligenceReport(BaseModel):
    symbol: str
    timeframe: str
    analyst_rating: str
    institutional_score: float
    setup_quality: str
    preferred_strategy: str
    trade_direction: str
    entry_zone: list[OpportunityLevel]
    exit_plan: list[OpportunityLevel]
    risk: OpportunityRisk
    narrative: OpportunityNarrative
    action_items: list[str]
