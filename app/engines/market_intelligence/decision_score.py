from __future__ import annotations
from pydantic import BaseModel

class DecisionFactor(BaseModel):
    name: str
    weight: float
    score: float
    contribution: float
    status: str
    note: str

class InstitutionalDecision(BaseModel):
    decision_score: float
    classification: str
    recommendation: str
    priority: str
    expected_r: float
    position_bias: str
    factors: list[DecisionFactor]
    top_reasons: list[str]
    concerns: list[str]
    explanation: str
