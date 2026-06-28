from __future__ import annotations

from dataclasses import dataclass

from app.engines.market_intelligence.strategy_score import ScoreComponent, StrategyScore
from app.engines.market_intelligence.technical_levels import TechnicalLevels


@dataclass(slots=True)
class StrategyScoringEngine:
    weights: dict[str, float] | None = None

    def __post_init__(self) -> None:
        if self.weights is None:
            self.weights = {
                "Trend": 25,
                "Momentum": 20,
                "Volume": 15,
                "Structure": 15,
                "Volatility": 10,
                "Relative Strength": 10,
                "Risk Quality": 5,
            }

    def score(self, technical: TechnicalLevels) -> StrategyScore:
        components = [
            self._trend_score(technical),
            self._momentum_score(technical),
            self._volume_score(technical),
            self._structure_score(technical),
            self._volatility_score(technical),
            self._relative_strength_score(technical),
            self._risk_quality_score(technical),
        ]

        overall = round(sum(component.contribution for component in components), 2)
        grade = self._grade(overall)
        confidence = self._confidence(overall, components)
        recommendation = self._recommendation(overall)

        return StrategyScore(
            overall_score=overall,
            grade=grade,
            confidence=confidence,
            recommendation=recommendation,
            components=components,
        )

    def _component(self, name: str, raw_score: float, status: str, note: str) -> ScoreComponent:
        weight = float(self.weights[name])
        normalized = max(0.0, min(100.0, raw_score))
        contribution = round((normalized / 100) * weight, 2)

        return ScoreComponent(
            name=name,
            weight=weight,
            score=round(normalized, 2),
            contribution=contribution,
            status=status,
            note=note,
        )

    def _trend_score(self, technical: TechnicalLevels) -> ScoreComponent:
        base = technical.trend_strength
        if technical.trend_direction == "bullish":
            status = "Bullish"
            note = "Fast EMA is above slow EMA."
            raw = min(100, 55 + base)
        elif technical.trend_direction == "bearish":
            status = "Bearish"
            note = "Fast EMA is below slow EMA."
            raw = min(100, 45 + base)
        else:
            status = "Neutral"
            note = "Fast and slow EMAs are not clearly separated."
            raw = 45

        return self._component("Trend", raw, status, note)

    def _momentum_score(self, technical: TechnicalLevels) -> ScoreComponent:
        distance_from_vwap = abs(technical.current_price - technical.vwap)
        raw = min(100, 55 + (distance_from_vwap / max(technical.atr, 0.01)) * 12)

        status = "Expanding" if raw >= 70 else "Moderate" if raw >= 50 else "Weak"
        note = "Momentum proxy uses distance from VWAP relative to ATR."

        return self._component("Momentum", raw, status, note)

    def _volume_score(self, technical: TechnicalLevels) -> ScoreComponent:
        raw = 65 if technical.current_price >= technical.vwap else 45
        status = "Supported" if raw >= 60 else "Unconfirmed"
        note = "Volume confirmation uses price position versus VWAP as a proxy."

        return self._component("Volume", raw, status, note)

    def _structure_score(self, technical: TechnicalLevels) -> ScoreComponent:
        range_size = max(technical.swing_high - technical.swing_low, 0.01)
        location = (technical.current_price - technical.swing_low) / range_size

        if technical.trend_direction == "bullish":
            raw = 50 + location * 45
            status = "Constructive" if location >= 0.55 else "Developing"
        elif technical.trend_direction == "bearish":
            raw = 50 + (1 - location) * 45
            status = "Constructive" if location <= 0.45 else "Developing"
        else:
            raw = 45
            status = "Neutral"

        note = "Structure score uses current price location inside recent swing range."
        return self._component("Structure", raw, status, note)

    def _volatility_score(self, technical: TechnicalLevels) -> ScoreComponent:
        atr_pct = technical.atr / max(technical.current_price, 0.01)

        if atr_pct < 0.01:
            raw = 55
            status = "Compressed"
        elif atr_pct < 0.04:
            raw = 85
            status = "Healthy"
        else:
            raw = 55
            status = "Elevated"

        note = "Volatility score favors tradable ATR without excessive expansion."
        return self._component("Volatility", raw, status, note)

    def _relative_strength_score(self, technical: TechnicalLevels) -> ScoreComponent:
        raw = 70 if technical.current_price > technical.ema_fast else 45
        status = "Strong" if raw >= 65 else "Weak"
        note = "Relative strength proxy uses price versus fast EMA."

        return self._component("Relative Strength", raw, status, note)

    def _risk_quality_score(self, technical: TechnicalLevels) -> ScoreComponent:
        raw = min(100, max(20, technical.risk_reward_2 * 25))
        status = "Favorable" if raw >= 70 else "Acceptable" if raw >= 50 else "Poor"
        note = "Risk quality is based on projected target 2 risk/reward."

        return self._component("Risk Quality", raw, status, note)

    def _grade(self, score: float) -> str:
        if score >= 85:
            return "A+"
        if score >= 75:
            return "A"
        if score >= 65:
            return "B"
        if score >= 55:
            return "C"
        return "D"

    def _confidence(self, score: float, components: list[ScoreComponent]) -> str:
        strong_components = sum(1 for component in components if component.score >= 70)

        if score >= 75 and strong_components >= 4:
            return "High"
        if score >= 60 and strong_components >= 2:
            return "Medium"
        return "Low"

    def _recommendation(self, score: float) -> str:
        if score >= 80:
            return "Tradeable"
        if score >= 65:
            return "Watch"
        return "Avoid"


strategy_scoring_engine = StrategyScoringEngine()
