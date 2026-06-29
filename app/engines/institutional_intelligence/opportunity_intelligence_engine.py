from __future__ import annotations

from dataclasses import dataclass

from app.engines.institutional_intelligence.opportunity_report import (
    OpportunityIntelligenceReport,
    OpportunityLevel,
    OpportunityNarrative,
    OpportunityRisk,
)
from app.engines.market_intelligence.confidence_score import ConfidenceScore
from app.engines.market_intelligence.decision_score import InstitutionalDecision
from app.engines.market_intelligence.strategy_score import StrategyScore
from app.engines.market_intelligence.technical_levels import TechnicalLevels
from app.engines.market_intelligence.trade_plan import TradePlan


@dataclass(slots=True)
class OpportunityIntelligenceEngine:
    def analyze(
        self,
        *,
        symbol: str,
        timeframe: str,
        technical: TechnicalLevels,
        strategy_score: StrategyScore,
        trade_plan: TradePlan,
        confidence: ConfidenceScore,
        decision: InstitutionalDecision,
    ) -> OpportunityIntelligenceReport:
        institutional_score = self._institutional_score(
            decision_score=decision.decision_score,
            confidence_score=confidence.confidence_score,
            strategy_score=strategy_score.overall_score,
            expected_r=trade_plan.expected_r_multiple,
        )

        return OpportunityIntelligenceReport(
            symbol=symbol.upper(),
            timeframe=timeframe,
            analyst_rating=self._rating(institutional_score),
            institutional_score=institutional_score,
            setup_quality=self._setup_quality(institutional_score),
            preferred_strategy=self._preferred_strategy(technical, trade_plan),
            trade_direction=trade_plan.direction,
            entry_zone=[
                OpportunityLevel(
                    label="Entry Low",
                    value=trade_plan.entry_price if trade_plan.direction == "short" else technical.entry_zone_low,
                    note="Lower boundary of the preferred execution zone.",
                ),
                OpportunityLevel(
                    label="Entry High",
                    value=technical.entry_zone_high if trade_plan.direction == "long" else trade_plan.entry_price,
                    note="Upper boundary of the preferred execution zone.",
                ),
            ],
            exit_plan=[
                OpportunityLevel(label="Stop Loss", value=trade_plan.stop_loss, note="Invalidation level."),
                OpportunityLevel(label="Target 1", value=trade_plan.target_1, note="First profit-taking level."),
                OpportunityLevel(label="Target 2", value=trade_plan.target_2, note="Primary extension target."),
                OpportunityLevel(label="Trailing Stop", value=trade_plan.trailing_stop, note="Dynamic runner protection level."),
            ],
            risk=self._risk(technical, trade_plan, confidence),
            narrative=self._narrative(technical, strategy_score, trade_plan, confidence, decision),
            action_items=self._action_items(decision, confidence, trade_plan),
        )

    def _institutional_score(
        self,
        *,
        decision_score: float,
        confidence_score: float,
        strategy_score: float,
        expected_r: float,
    ) -> float:
        rr_score = max(0.0, min(100.0, expected_r * 25.0))
        return round(
            decision_score * 0.42
            + confidence_score * 0.25
            + strategy_score * 0.20
            + rr_score * 0.13,
            2,
        )

    def _rating(self, score: float) -> str:
        if score >= 90:
            return "Institutional Grade"
        if score >= 80:
            return "Trade Desk Approved"
        if score >= 65:
            return "Watchlist Candidate"
        if score >= 50:
            return "Speculative"
        return "Avoid"

    def _setup_quality(self, score: float) -> str:
        if score >= 90:
            return "Elite"
        if score >= 80:
            return "High"
        if score >= 65:
            return "Developing"
        if score >= 50:
            return "Low Conviction"
        return "Poor"

    def _preferred_strategy(self, technical: TechnicalLevels, trade_plan: TradePlan) -> str:
        rr = trade_plan.risk_reward_2

        if technical.trend_strength >= 75 and rr >= 3:
            return "Trend Continuation"
        if technical.trend_strength >= 55 and rr >= 2:
            return "Pullback Continuation"
        if technical.trend_strength < 45:
            return "Mean Reversion / Avoid Trend Entry"
        return "Confirmation Required"

    def _risk(
        self,
        technical: TechnicalLevels,
        trade_plan: TradePlan,
        confidence: ConfidenceScore,
    ) -> OpportunityRisk:
        atr_pct = technical.atr / max(technical.current_price, 0.01)
        risk_score = max(0, min(100, 100 - (atr_pct * 1000)))

        if confidence.confidence_label == "High" and trade_plan.risk_reward_2 >= 3:
            risk_level = "Controlled"
        elif confidence.confidence_label == "Medium":
            risk_level = "Moderate"
        else:
            risk_level = "Elevated"

        return OpportunityRisk(
            risk_level=risk_level,
            risk_score=round(risk_score, 2),
            liquidity_note="Demo liquidity model active. Replace with live volume and spread data during broker/data integration.",
            volatility_note=f"ATR is approximately {atr_pct:.2%} of current price.",
            execution_note=f"Execution action: {trade_plan.action}.",
        )

    def _narrative(
        self,
        technical: TechnicalLevels,
        strategy_score: StrategyScore,
        trade_plan: TradePlan,
        confidence: ConfidenceScore,
        decision: InstitutionalDecision,
    ) -> OpportunityNarrative:
        bullish_case = [
            f"Trend direction is {technical.trend_direction}.",
            f"Strategy grade is {strategy_score.grade}.",
            f"Confidence engine reports {confidence.confidence_label} confidence.",
        ]

        bearish_case = []

        if trade_plan.risk_reward_2 < 2:
            bearish_case.append("Risk/reward is below the preferred institutional threshold.")
        if confidence.confidence_label == "Low":
            bearish_case.append("Confidence is low and requires additional confirmation.")
        if technical.trend_strength < 50:
            bearish_case.append("Trend strength is weak.")

        if not bearish_case:
            bearish_case.append("No major opposing factors detected by the current engine.")

        return OpportunityNarrative(
            summary=(
                f"{decision.classification}: {decision.recommendation}. "
                f"The setup is {technical.trend_direction} with {strategy_score.grade} strategy quality "
                f"and {confidence.confidence_label.lower()} confidence."
            ),
            bullish_case=bullish_case,
            bearish_case=bearish_case,
            trade_plan_summary=(
                f"Direction {trade_plan.direction}; entry {trade_plan.entry_price}; "
                f"stop {trade_plan.stop_loss}; target 2 {trade_plan.target_2}; "
                f"expected R {trade_plan.expected_r_multiple}."
            ),
            decision_note=decision.explanation,
        )

    def _action_items(
        self,
        decision: InstitutionalDecision,
        confidence: ConfidenceScore,
        trade_plan: TradePlan,
    ) -> list[str]:
        if decision.recommendation == "Avoid":
            return [
                "Do not open a new position.",
                "Wait for improved trend, confidence, or risk/reward.",
            ]

        items = [
            "Confirm price is inside or near the preferred entry zone.",
            "Verify stop level before position sizing.",
            "Use planned risk percentage and avoid exceeding suggested notional exposure.",
        ]

        if confidence.confidence_label != "High":
            items.append("Require additional confirmation before entry.")

        if trade_plan.expected_r_multiple < 1:
            items.append("Expected R is weak; reduce size or wait.")

        return items


opportunity_intelligence_engine = OpportunityIntelligenceEngine()
