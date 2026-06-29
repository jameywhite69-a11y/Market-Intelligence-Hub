from __future__ import annotations
from pydantic import BaseModel

class ConfidenceFactor(BaseModel):
    name: str
    score: float
    status: str
    note: str

class ConfidenceScore(BaseModel):
    confidence_score: float
    confidence_label: str
    decision: str
    factors: list[ConfidenceFactor]
    summary: str
