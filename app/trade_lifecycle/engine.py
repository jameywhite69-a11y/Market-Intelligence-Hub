from __future__ import annotations

from uuid import uuid4
from datetime import datetime

from app.trade_lifecycle.models import TradeLifecycleEvent, TradeLifecycleRecord, TradeStage


class TradeLifecycleEngine:
    def __init__(self) -> None:
        self.records: dict[str, TradeLifecycleRecord] = {}

    def key(self, symbol: str, timeframe: str = "15m") -> str:
        return f"{symbol.upper()}:{timeframe}"

    def stage_for_opportunity(self, score: float, expected_r: float, confidence: str) -> TradeStage:
        if score >= 85 and expected_r >= 1.5:
            return TradeStage.execution_ready
        if score >= 75:
            return TradeStage.qualified
        if score >= 60:
            return TradeStage.watch
        return TradeStage.candidate

    def upsert_from_opportunity(self, opportunity: dict, source: str = "opportunity") -> dict:
        symbol = str(opportunity.get("symbol", "UNKNOWN")).upper()
        timeframe = str(opportunity.get("timeframe", "15m"))
        score = float(opportunity.get("score", opportunity.get("overall_score", 0.0)) or 0.0)
        expected_r = float(opportunity.get("expectedR", opportunity.get("expected_r", 0.0)) or 0.0)
        confidence = str(opportunity.get("confidence", opportunity.get("confidence_label", "Medium")))

        key = self.key(symbol, timeframe)
        record = self.records.get(key) or TradeLifecycleRecord(
            key=key,
            symbol=symbol,
            timeframe=timeframe,
        )

        next_stage = self.stage_for_opportunity(score, expected_r, confidence)
        if record.entered and not record.closed:
            next_stage = TradeStage.managing

        record.score = score
        record.expected_r = expected_r
        record.confidence = confidence

        if record.stage != next_stage.value:
            self.transition(record, next_stage, f"Opportunity updated: score {score:.1f}, expected R {expected_r:.2f}.", source)

        record.updated_at = datetime.utcnow().isoformat()
        self.records[key] = record
        return record.model_dump()

    def mark_entered(self, symbol: str, timeframe: str = "15m", source: str = "execution") -> dict:
        key = self.key(symbol, timeframe)
        record = self.records.get(key) or TradeLifecycleRecord(key=key, symbol=symbol.upper(), timeframe=timeframe)
        record.entered = True
        record.closed = False
        self.transition(record, TradeStage.entered, "Order filled and position opened.", source)
        self.records[key] = record
        return record.model_dump()

    def mark_partial_exit(self, symbol: str, timeframe: str = "15m", source: str = "execution") -> dict:
        key = self.key(symbol, timeframe)
        record = self.records.get(key) or TradeLifecycleRecord(key=key, symbol=symbol.upper(), timeframe=timeframe)
        self.transition(record, TradeStage.partial_exit, "Partial exit detected.", source)
        self.records[key] = record
        return record.model_dump()

    def mark_runner(self, symbol: str, timeframe: str = "15m", source: str = "position") -> dict:
        key = self.key(symbol, timeframe)
        record = self.records.get(key) or TradeLifecycleRecord(key=key, symbol=symbol.upper(), timeframe=timeframe)
        self.transition(record, TradeStage.runner, "Position moved into runner state.", source)
        self.records[key] = record
        return record.model_dump()

    def mark_closed(self, symbol: str, timeframe: str = "15m", source: str = "execution") -> dict:
        key = self.key(symbol, timeframe)
        record = self.records.get(key) or TradeLifecycleRecord(key=key, symbol=symbol.upper(), timeframe=timeframe)
        record.closed = True
        self.transition(record, TradeStage.closed, "Position closed.", source)
        self.records[key] = record
        return record.model_dump()

    def transition(self, record: TradeLifecycleRecord, stage: TradeStage, reason: str, source: str) -> None:
        event = TradeLifecycleEvent(
            event_id=str(uuid4()),
            symbol=record.symbol,
            timeframe=record.timeframe,
            previous_stage=record.stage,
            new_stage=stage.value,
            reason=reason,
            source=source,
        )
        record.stage = stage.value
        record.events.append(event)
        record.events = record.events[-50:]
        record.updated_at = datetime.utcnow().isoformat()

    def snapshot(self) -> dict:
        return {
            "records": [record.model_dump() for record in self.records.values()],
            "count": len(self.records),
        }

    def reset(self) -> dict:
        self.records.clear()
        return self.snapshot()


trade_lifecycle_engine = TradeLifecycleEngine()
