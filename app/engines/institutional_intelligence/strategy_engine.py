from __future__ import annotations

from dataclasses import dataclass

from app.engines.institutional_intelligence.confluence_score import ConfluenceScore
from app.engines.institutional_intelligence.strategy_matrix import StrategyCandidate, StrategyMatrix
from app.engines.market_intelligence.technical_levels import TechnicalLevels
from app.engines.market_intelligence.trade_plan import TradePlan


@dataclass(slots=True)
class InstitutionalStrategyEngine:
    def evaluate(
        self,
        *,
        technical: TechnicalLevels,
        trade_plan: TradePlan,
        confluence: ConfluenceScore | None = None,
    ) -> StrategyMatrix:
        candidates = [
            self._trend_following(technical, trade_plan, confluence),
            self._pullback_continuation(technical, trade_plan, confluence),
            self._breakout(technical, trade_plan, confluence),
            self._mean_reversion(technical, trade_plan),
            self._momentum(technical, confluence),
            self._opening_range_breakout(technical, confluence),
            self._scalping(technical, trade_plan),
        ]

        candidates.sort(key=lambda item: item.score, reverse=True)

        primary = candidates[0]
        secondary = candidates[1] if len(candidates) > 1 else None
        avoid = min(candidates, key=lambda item: item.score)
        average = round(sum(item.score for item in candidates) / len(candidates), 2)

        return StrategyMatrix(
            primary_strategy=primary.name,
            secondary_strategy=secondary.name if secondary else None,
            avoid_strategy=avoid.name if avoid.score < 45 else None,
            strategy_agreement=self._agreement(candidates),
            strategy_confidence=self._confidence(primary.score),
            best_score=round(primary.score, 2),
            average_score=average,
            candidates=candidates,
            narrative=self._narrative(primary, secondary, avoid, candidates),
        )

    def _candidate(self, name: str, score: float, note: str) -> StrategyCandidate:
        score = max(0.0, min(100.0, score))
        return StrategyCandidate(
            name=name,
            score=round(score, 2),
            confidence=self._confidence(score),
            classification=self._classification(score),
            note=note,
        )

    def _confidence(self, score: float) -> str:
        if score >= 85:
            return "High"
        if score >= 65:
            return "Medium"
        return "Low"

    def _classification(self, score: float) -> str:
        if score >= 85:
            return "Preferred"
        if score >= 70:
            return "Tradeable"
        if score >= 55:
            return "Watch"
        return "Avoid"

    def _trend_following(
        self,
        technical: TechnicalLevels,
        trade_plan: TradePlan,
        confluence: ConfluenceScore | None,
    ) -> StrategyCandidate:
        confluence_boost = (confluence.confluence_score - 65) * 0.20 if confluence else 0
        score = (
            technical.trend_strength * 0.55
            + (100 if technical.ema_fast > technical.ema_slow else 35) * 0.25
            + min(100, trade_plan.risk_reward_2 * 25) * 0.20
            + confluence_boost
        )
        return self._candidate(
            "Trend Following",
            score,
            "Scores sustained directional alignment, EMA structure, confluence, and acceptable reward.",
        )

    def _pullback_continuation(
        self,
        technical: TechnicalLevels,
        trade_plan: TradePlan,
        confluence: ConfluenceScore | None,
    ) -> StrategyCandidate:
        distance_to_ema = abs(technical.current_price - technical.ema_fast) / max(technical.atr, 0.01)
        proximity_score = max(0, 100 - distance_to_ema * 20)
        confluence_score = confluence.confluence_score if confluence else 65

        score = (
            technical.trend_strength * 0.35
            + proximity_score * 0.30
            + confluence_score * 0.20
            + min(100, trade_plan.risk_reward_2 * 25) * 0.15
        )
        return self._candidate(
            "Pullback Continuation",
            score,
            "Scores trend strength plus proximity to the fast EMA entry zone.",
        )

    def _breakout(
        self,
        technical: TechnicalLevels,
        trade_plan: TradePlan,
        confluence: ConfluenceScore | None,
    ) -> StrategyCandidate:
        range_size = max(technical.swing_high - technical.swing_low, 0.01)
        breakout_location = (technical.current_price - technical.swing_low) / range_size
        breakout_score = max(0, min(100, breakout_location * 100))
        confluence_score = confluence.confluence_score if confluence else 65

        score = breakout_score * 0.45 + technical.trend_strength * 0.25 + confluence_score * 0.20 + min(100, trade_plan.risk_reward_2 * 25) * 0.10

        return self._candidate(
            "Breakout",
            score,
            "Scores current price location near the top of the swing range with trend support.",
        )

    def _mean_reversion(self, technical: TechnicalLevels, trade_plan: TradePlan) -> StrategyCandidate:
        distance_from_vwap = abs(technical.current_price - technical.vwap) / max(technical.atr, 0.01)
        reversion_score = max(0, min(100, distance_from_vwap * 12))
        trend_penalty = max(0, 100 - technical.trend_strength)

        score = reversion_score * 0.55 + trend_penalty * 0.35 + min(100, trade_plan.risk_reward_2 * 25) * 0.10

        return self._candidate(
            "Mean Reversion",
            score,
            "Scores distance from VWAP and weaker trend conditions.",
        )

    def _momentum(self, technical: TechnicalLevels, confluence: ConfluenceScore | None) -> StrategyCandidate:
        momentum_proxy = abs(technical.current_price - technical.vwap) / max(technical.atr, 0.01)
        momentum_score = min(100, momentum_proxy * 20)
        confluence_score = confluence.confluence_score if confluence else 65

        score = technical.trend_strength * 0.40 + momentum_score * 0.35 + confluence_score * 0.25

        return self._candidate(
            "Momentum",
            score,
            "Scores trend strength, price extension from VWAP, and confluence confirmation.",
        )

    def _opening_range_breakout(
        self,
        technical: TechnicalLevels,
        confluence: ConfluenceScore | None,
    ) -> StrategyCandidate:
        range_size = max(technical.swing_high - technical.swing_low, 0.01)
        range_expansion = min(100, (range_size / max(technical.atr, 0.01)) * 12)
        confluence_score = confluence.confluence_score if confluence else 65

        score = range_expansion * 0.45 + technical.trend_strength * 0.25 + confluence_score * 0.30

        return self._candidate(
            "Opening Range Breakout",
            score,
            "Scores swing-range expansion, trend quality, and confluence.",
        )

    def _scalping(self, technical: TechnicalLevels, trade_plan: TradePlan) -> StrategyCandidate:
        atr_pct = technical.atr / max(technical.current_price, 0.01)
        volatility_score = 85 if 0.003 <= atr_pct <= 0.025 else 55
        execution_score = 80 if trade_plan.action != "Avoid" else 35

        score = volatility_score * 0.35 + execution_score * 0.35 + technical.trend_strength * 0.30

        return self._candidate(
            "Scalping",
            score,
            "Scores short-duration execution readiness, tradable volatility, and trend quality.",
        )

    def _agreement(self, candidates: list[StrategyCandidate]) -> str:
        strong = sum(1 for item in candidates if item.score >= 75)
        if strong >= 4:
            return "Broad Agreement"
        if strong >= 2:
            return "Selective Agreement"
        return "Low Agreement"

    def _narrative(
        self,
        primary: StrategyCandidate,
        secondary: StrategyCandidate | None,
        avoid: StrategyCandidate,
        candidates: list[StrategyCandidate],
    ) -> str:
        secondary_text = f" Secondary strategy is {secondary.name}." if secondary else ""
        avoid_text = f" Weakest strategy is {avoid.name}." if avoid.score < 55 else ""
        return (
            f"Primary strategy is {primary.name} with {primary.confidence.lower()} confidence "
            f"and a score of {primary.score:.1f}.{secondary_text}{avoid_text}"
        )


institutional_strategy_engine = InstitutionalStrategyEngine()
