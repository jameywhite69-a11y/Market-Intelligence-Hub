from __future__ import annotations

from dataclasses import dataclass, field

from app.engines.portfolio_intelligence.opportunity_lifecycle import (
    LifecycleEvent,
    OpportunityLifecycle,
)


@dataclass(slots=True)
class OpportunityLifecycleEngine:
    scan_counter: int = 0
    history: dict[str, list[dict]] = field(default_factory=dict)

    def evaluate(
        self,
        *,
        symbol: str,
        timeframe: str,
        opportunity_score: float,
        confidence_score: float,
        decision_classification: str,
        recommendation: str,
        confluence_score: float | None = None,
    ) -> OpportunityLifecycle:
        self.scan_counter += 1
        key = f"{symbol.upper()}:{timeframe}"
        rows = self.history.setdefault(key, [])

        previous = rows[-1] if rows else None

        current = {
            "scan": self.scan_counter,
            "symbol": symbol.upper(),
            "timeframe": timeframe,
            "opportunity_score": float(opportunity_score or 0),
            "confidence_score": float(confidence_score or 0),
            "decision_classification": decision_classification,
            "recommendation": recommendation,
            "confluence_score": float(confluence_score or 0),
        }

        rows.append(current)
        if len(rows) > 10:
            self.history[key] = rows[-10:]
            rows = self.history[key]

        score_delta = current["opportunity_score"] - (previous["opportunity_score"] if previous else current["opportunity_score"])
        confidence_delta = current["confidence_score"] - (previous["confidence_score"] if previous else current["confidence_score"])

        stage = self._stage(current)
        trigger_state = self._trigger_state(current, stage)
        momentum = self._momentum(score_delta, confidence_delta)
        events = self._events(current, previous, score_delta, confidence_delta)

        return OpportunityLifecycle(
            symbol=symbol.upper(),
            timeframe=timeframe,
            lifecycle_stage=stage,
            trigger_state=trigger_state,
            score_change=round(score_delta, 2),
            confidence_change=round(confidence_delta, 2),
            momentum_state=momentum,
            first_seen_scan=rows[0]["scan"],
            last_seen_scan=current["scan"],
            scans_seen=len(rows),
            events=events,
            narrative=self._narrative(symbol.upper(), stage, trigger_state, momentum, score_delta, confidence_delta),
        )

    def _stage(self, row: dict) -> str:
        score = row["opportunity_score"]
        confidence = row["confidence_score"]
        recommendation = row["recommendation"]

        if recommendation == "Avoid" or score < 50:
            return "Rejected"
        if score >= 90 and confidence >= 80:
            return "A+ Setup"
        if score >= 80:
            return "Building"
        if score >= 65:
            return "Candidate"
        return "Detected"

    def _trigger_state(self, row: dict, stage: str) -> str:
        if stage == "A+ Setup" and row["recommendation"] in {"Plan Trade", "Enter on Confirmation"}:
            return "Ready"
        if stage in {"Building", "Candidate"}:
            return "Waiting"
        if stage == "Rejected":
            return "Invalid"
        return "Monitoring"

    def _momentum(self, score_delta: float, confidence_delta: float) -> str:
        combined = score_delta + confidence_delta * 0.5
        if combined >= 4:
            return "Improving"
        if combined <= -4:
            return "Degrading"
        return "Stable"

    def _events(
        self,
        current: dict,
        previous: dict | None,
        score_delta: float,
        confidence_delta: float,
    ) -> list[LifecycleEvent]:
        events: list[LifecycleEvent] = []

        if previous is None:
            events.append(
                LifecycleEvent(
                    event_type="Detected",
                    message="Opportunity detected for the first time in lifecycle tracking.",
                    score_delta=0,
                    confidence_delta=0,
                )
            )
            return events

        if score_delta >= 5:
            events.append(
                LifecycleEvent(
                    event_type="Score Improved",
                    message=f"Opportunity score improved by {score_delta:.1f}.",
                    score_delta=round(score_delta, 2),
                    confidence_delta=round(confidence_delta, 2),
                )
            )

        if score_delta <= -5:
            events.append(
                LifecycleEvent(
                    event_type="Score Degraded",
                    message=f"Opportunity score weakened by {abs(score_delta):.1f}.",
                    score_delta=round(score_delta, 2),
                    confidence_delta=round(confidence_delta, 2),
                )
            )

        if confidence_delta >= 5:
            events.append(
                LifecycleEvent(
                    event_type="Confidence Improved",
                    message=f"Confidence improved by {confidence_delta:.1f}.",
                    score_delta=round(score_delta, 2),
                    confidence_delta=round(confidence_delta, 2),
                )
            )

        if current["decision_classification"] != previous["decision_classification"]:
            events.append(
                LifecycleEvent(
                    event_type="Stage Changed",
                    message=f"Decision changed from {previous['decision_classification']} to {current['decision_classification']}.",
                    score_delta=round(score_delta, 2),
                    confidence_delta=round(confidence_delta, 2),
                )
            )

        if not events:
            events.append(
                LifecycleEvent(
                    event_type="Stable",
                    message="Opportunity remains stable compared with the previous scan.",
                    score_delta=round(score_delta, 2),
                    confidence_delta=round(confidence_delta, 2),
                )
            )

        return events

    def _narrative(
        self,
        symbol: str,
        stage: str,
        trigger: str,
        momentum: str,
        score_delta: float,
        confidence_delta: float,
    ) -> str:
        return (
            f"{symbol} is in lifecycle stage {stage} with trigger state {trigger}. "
            f"Momentum is {momentum}. Score change is {score_delta:+.1f}; "
            f"confidence change is {confidence_delta:+.1f}."
        )


opportunity_lifecycle_engine = OpportunityLifecycleEngine()
