from __future__ import annotations

from enum import Enum
from uuid import uuid4

from pydantic import BaseModel, Field


class PositionRuleType(str, Enum):
    stop_loss = "stop_loss"
    take_profit = "take_profit"
    break_even = "break_even"
    trailing_stop = "trailing_stop"


class ManagedPositionRule(BaseModel):
    rule_id: str = Field(default_factory=lambda: str(uuid4()))
    symbol: str
    rule_type: PositionRuleType
    trigger_price: float | None = None
    target_price: float | None = None
    trail_percent: float | None = None
    quantity_percent: float = 100.0
    enabled: bool = True
    status: str = "active"


class ManagedPositionState(BaseModel):
    symbol: str
    lifecycle: str = "Watching"
    entry_price: float | None = None
    current_price: float | None = None
    stop_loss: float | None = None
    target_1: float | None = None
    target_2: float | None = None
    trailing_stop: float | None = None
    risk_per_share: float | None = None
    r_multiple: float = 0.0
    rules: list[ManagedPositionRule] = []


class PositionManagementEngine:
    def __init__(self) -> None:
        self.managed: dict[str, ManagedPositionState] = {}

    def reset(self) -> None:
        self.managed.clear()

    def sync_from_snapshot(self, snapshot: dict) -> list[dict]:
        open_symbols = set()

        for position in snapshot.get("open_positions", []):
            symbol = str(position.get("symbol", "")).upper()
            if not symbol:
                continue

            open_symbols.add(symbol)
            current = float(position.get("market_price") or position.get("average_price") or 0)
            entry = float(position.get("average_price") or current or 0)

            state = self.managed.get(symbol) or ManagedPositionState(
                symbol=symbol,
                lifecycle="Filled",
                entry_price=entry,
                current_price=current,
                stop_loss=round(entry * 0.97, 4),
                target_1=round(entry * 1.02, 4),
                target_2=round(entry * 1.04, 4),
                trailing_stop=round(entry * 0.98, 4),
                risk_per_share=round(entry - (entry * 0.97), 4),
            )

            state.current_price = current
            state.entry_price = entry
            state.risk_per_share = max(0.0001, abs(entry - float(state.stop_loss or entry)))
            state.r_multiple = round((current - entry) / state.risk_per_share, 2)

            if not state.rules:
                state.rules = [
                    ManagedPositionRule(symbol=symbol, rule_type=PositionRuleType.stop_loss, trigger_price=state.stop_loss),
                    ManagedPositionRule(symbol=symbol, rule_type=PositionRuleType.take_profit, target_price=state.target_1, quantity_percent=50),
                    ManagedPositionRule(symbol=symbol, rule_type=PositionRuleType.take_profit, target_price=state.target_2, quantity_percent=50),
                    ManagedPositionRule(symbol=symbol, rule_type=PositionRuleType.trailing_stop, trigger_price=state.trailing_stop, trail_percent=2),
                ]

            if state.r_multiple >= 2:
                state.lifecycle = "Runner"
            elif state.r_multiple >= 1:
                state.lifecycle = "TP1 Zone"
            else:
                state.lifecycle = "Filled"

            self.managed[symbol] = state

        for symbol in list(self.managed.keys()):
            if symbol not in open_symbols:
                self.managed[symbol].lifecycle = "Closed"

        return [state.model_dump() for state in self.managed.values()]

    def snapshot(self) -> dict:
        return {"managed_positions": [state.model_dump() for state in self.managed.values()]}


position_management_engine = PositionManagementEngine()
