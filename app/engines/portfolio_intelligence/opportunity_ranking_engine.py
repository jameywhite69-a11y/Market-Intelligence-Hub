from __future__ import annotations

from dataclasses import dataclass

from app.engines.portfolio_intelligence.allocation_engine import AllocationEngine
from app.engines.portfolio_intelligence.momentum_tracker import MomentumTracker
from app.engines.portfolio_intelligence.opportunity_rank import (
    OpportunityPortfolioSnapshot,
    RankedOpportunity,
)


@dataclass(slots=True)
class OpportunityRankingEngine:
    allocation_engine: AllocationEngine | None = None
    momentum_tracker: MomentumTracker | None = None

    def __post_init__(self) -> None:
        self.allocation_engine = self.allocation_engine or AllocationEngine()
        self.momentum_tracker = self.momentum_tracker or MomentumTracker()

    def rank(
        self,
        *,
        opportunities: list[dict],
        previous_scores: dict[str, float] | None = None,
    ) -> OpportunityPortfolioSnapshot:
        previous_scores = previous_scores or {}

        scored: list[dict] = []

        for item in opportunities:
            decision = item.get("decision") or {}
            confidence = item.get("confidence") or {}
            strategy = item.get("strategy_score") or {}
            trade_plan = item.get("trade_plan") or {}

            decision_score = float(decision.get("decision_score") or 0)
            confidence_score = float(confidence.get("confidence_score") or 0)
            strategy_score = float(strategy.get("overall_score") or 0)
            expected_r = float(trade_plan.get("expected_r_multiple") or 0)

            opportunity_score = self._opportunity_score(
                decision_score=decision_score,
                confidence_score=confidence_score,
                strategy_score=strategy_score,
                expected_r=expected_r,
            )

            key = self._key(item)
            momentum = self.momentum_tracker.compare(
                opportunity_score,
                previous_scores.get(key),
            )

            scored.append(
                {
                    "item": item,
                    "key": key,
                    "opportunity_score": opportunity_score,
                    "decision_score": decision_score,
                    "confidence_score": confidence_score,
                    "strategy_score": strategy_score,
                    "expected_r": expected_r,
                    "momentum": momentum,
                }
            )

        scored.sort(key=lambda row: row["opportunity_score"], reverse=True)

        allocations = self.allocation_engine.allocate(
            [row["opportunity_score"] for row in scored]
        )

        ranked: list[RankedOpportunity] = []

        for index, row in enumerate(scored):
            item = row["item"]
            decision = item.get("decision") or {}

            ranked.append(
                RankedOpportunity(
                    rank=index + 1,
                    symbol=item.get("symbol", ""),
                    timeframe=item.get("timeframe", ""),
                    opportunity_score=round(row["opportunity_score"], 2),
                    decision_score=round(row["decision_score"], 2),
                    confidence_score=round(row["confidence_score"], 2),
                    strategy_score=round(row["strategy_score"], 2),
                    expected_r=round(row["expected_r"], 2),
                    allocation_percent=allocations[index] if index < len(allocations) else 0,
                    momentum=row["momentum"],
                    classification=decision.get("classification", "Unknown"),
                    recommendation=decision.get("recommendation", "Unknown"),
                )
            )

        top = ranked[0] if ranked else None
        highest_confidence = max(ranked, key=lambda item: item.confidence_score) if ranked else None
        best_rr = max(ranked, key=lambda item: item.expected_r) if ranked else None
        largest_allocation = max(ranked, key=lambda item: item.allocation_percent) if ranked else None

        return OpportunityPortfolioSnapshot(
            top_opportunity=top,
            highest_confidence=highest_confidence,
            best_risk_reward=best_rr,
            largest_allocation=largest_allocation,
            ranked_opportunities=ranked,
        )

    def _opportunity_score(
        self,
        *,
        decision_score: float,
        confidence_score: float,
        strategy_score: float,
        expected_r: float,
    ) -> float:
        risk_reward_score = min(100.0, max(0.0, expected_r * 25.0))

        return (
            decision_score * 0.40
            + confidence_score * 0.25
            + strategy_score * 0.20
            + risk_reward_score * 0.15
        )

    def _key(self, item: dict) -> str:
        return f"{item.get('symbol', '')}:{item.get('timeframe', '')}"


opportunity_ranking_engine = OpportunityRankingEngine()
