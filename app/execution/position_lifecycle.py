from __future__ import annotations

from enum import Enum
from pydantic import BaseModel, Field


class PositionLifecycleState(str, Enum):
    candidate = "Candidate"
    submitted = "Submitted"
    working = "Working"
    filled = "Filled"
    protected = "Protected"
    tp1 = "TP1"
    runner = "Runner"
    closed = "Closed"


class PositionLifecycleEvent(BaseModel):
    symbol: str
    previous_state: str | None = None
    new_state: str
    reason: str
    timestamp: str


class LifecycleSnapshot(BaseModel):
    states: dict[str, str] = Field(default_factory=dict)
    events: list[PositionLifecycleEvent] = Field(default_factory=list)


class PositionLifecycleEngine:
    def __init__(self) -> None:
        self.states: dict[str, str] = {}
        self.events: list[PositionLifecycleEvent] = []

    def transition(self, symbol: str, new_state: PositionLifecycleState | str, reason: str) -> dict:
        from datetime import datetime

        symbol = symbol.upper()
        previous = self.states.get(symbol)
        state_value = new_state.value if isinstance(new_state, PositionLifecycleState) else str(new_state)
        self.states[symbol] = state_value

        event = PositionLifecycleEvent(
            symbol=symbol,
            previous_state=previous,
            new_state=state_value,
            reason=reason,
            timestamp=datetime.utcnow().isoformat(),
        )
        self.events.append(event)
        if len(self.events) > 250:
            self.events = self.events[-250:]

        return event.model_dump()

    def sync_position(self, symbol: str, r_multiple: float, has_stop: bool = True) -> dict:
        if r_multiple >= 2:
            return self.transition(symbol, PositionLifecycleState.runner, "Position is at or above +2R.")
        if r_multiple >= 1:
            return self.transition(symbol, PositionLifecycleState.tp1, "Position is at or above +1R.")
        if has_stop:
            return self.transition(symbol, PositionLifecycleState.protected, "Position has protective stop.")
        return self.transition(symbol, PositionLifecycleState.filled, "Position is filled.")

    def close(self, symbol: str, reason: str = "Position closed.") -> dict:
        return self.transition(symbol, PositionLifecycleState.closed, reason)

    def snapshot(self) -> dict:
        return LifecycleSnapshot(states=self.states, events=self.events).model_dump()


position_lifecycle_engine = PositionLifecycleEngine()
