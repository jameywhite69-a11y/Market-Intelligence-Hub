from __future__ import annotations

from pydantic import BaseModel


class LifecycleEvent(BaseModel):
    event_type: str
    message: str
    score_delta: float
    confidence_delta: float


class OpportunityLifecycle(BaseModel):
    symbol: str
    timeframe: str
    lifecycle_stage: str
    trigger_state: str
    score_change: float
    confidence_change: float
    momentum_state: str
    first_seen_scan: int
    last_seen_scan: int
    scans_seen: int
    events: list[LifecycleEvent]
    narrative: str
