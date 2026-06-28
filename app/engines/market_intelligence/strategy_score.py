from __future__ import annotations

from pydantic import BaseModel


class ScoreComponent(BaseModel):
    name: str
    weight: float
    score: float
    contribution: float
    status: str
    note: str


class StrategyScore(BaseModel):
    overall_score: float
    grade: str
    confidence: str
    recommendation: str
    components: list[ScoreComponent]
