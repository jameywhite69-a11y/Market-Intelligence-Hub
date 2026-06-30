from __future__ import annotations
from pydantic import BaseModel, Field

class DecisionFactor(BaseModel):
    name: str
    score: float
    status: str
    explanation: str

class AIDecisionNarrative(BaseModel):
    symbol: str
    timeframe: str
    recommendation: str
    confidence_score: float
    confidence_label: str
    decision: str
    summary: str
    bullish_case: list[str] = Field(default_factory=list)
    bearish_case: list[str] = Field(default_factory=list)
    action_plan: list[str] = Field(default_factory=list)
    risk_notes: list[str] = Field(default_factory=list)
    factors: list[DecisionFactor] = Field(default_factory=list)
