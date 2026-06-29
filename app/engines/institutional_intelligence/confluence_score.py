from __future__ import annotations

from pydantic import BaseModel


class TimeframeConfluence(BaseModel):
    timeframe: str
    weight: float
    trend_direction: str
    trend_strength: float
    score: float
    contribution: float
    status: str
    note: str


class ConfluenceScore(BaseModel):
    symbol: str
    primary_timeframe: str
    confluence_score: float
    alignment_rating: str
    alignment_label: str
    dominant_direction: str
    conflict_detected: bool
    counter_trend: bool
    confidence_adjustment: float
    final_confidence_projection: float
    timeframes: list[TimeframeConfluence]
    narrative: str
