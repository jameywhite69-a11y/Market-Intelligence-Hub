from __future__ import annotations

from pydantic import BaseModel


class StrategyCandidate(BaseModel):
    name: str
    score: float
    confidence: str
    classification: str
    note: str


class StrategyMatrix(BaseModel):
    primary_strategy: str
    secondary_strategy: str | None
    avoid_strategy: str | None
    strategy_agreement: str
    strategy_confidence: str
    best_score: float
    average_score: float
    candidates: list[StrategyCandidate]
    narrative: str
