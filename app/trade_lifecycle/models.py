from __future__ import annotations

from enum import Enum
from pydantic import BaseModel, Field
from datetime import datetime


class TradeStage(str, Enum):
    candidate = "Candidate"
    watch = "Watch"
    qualified = "Qualified"
    execution_ready = "Execution Ready"
    entered = "Entered"
    managing = "Managing"
    partial_exit = "Partial Exit"
    runner = "Runner"
    closed = "Closed"
    archived = "Archived"


class TradeLifecycleEvent(BaseModel):
    event_id: str
    symbol: str
    timeframe: str = "15m"
    previous_stage: str | None = None
    new_stage: str
    reason: str
    source: str = "system"
    timestamp: str = Field(default_factory=lambda: datetime.utcnow().isoformat())


class TradeLifecycleRecord(BaseModel):
    key: str
    symbol: str
    timeframe: str = "15m"
    stage: str = TradeStage.candidate.value
    score: float = 0.0
    confidence: str = "Medium"
    expected_r: float = 0.0
    entered: bool = False
    closed: bool = False
    events: list[TradeLifecycleEvent] = Field(default_factory=list)
    updated_at: str = Field(default_factory=lambda: datetime.utcnow().isoformat())
