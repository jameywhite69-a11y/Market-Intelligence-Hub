from __future__ import annotations

from dataclasses import dataclass, field

from app.engines.institutional_intelligence.confluence_score import (
    ConfluenceScore,
    TimeframeConfluence,
)
from app.engines.market_intelligence.confidence_score import ConfidenceScore
from app.engines.market_intelligence.technical_levels import TechnicalLevels


@dataclass(slots=True)
class ConfluenceEngine:
    timeframe_weights: dict[str, float] = field(
        default_factory=lambda: {
            "5m": 10.0,
            "15m": 20.0,
            "1h": 30.0,
            "4h": 25.0,
            "1d": 15.0,
        }
    )

    timeframe_aliases: dict[str, str] = field(
        default_factory=lambda: {
            "5": "5m",
            "15": "15m",
            "60": "1h",
            "240": "4h",
            "d": "1d",
            "day": "1d",
            "daily": "1d",
            "1D": "1d",
            "1H": "1h",
            "4H": "4h",
        }
    )

    def evaluate(
        self,
        *,
        symbol: str,
        primary_timeframe: str,
        timeframe_levels: dict[str, TechnicalLevels],
        base_confidence: ConfidenceScore | None = None,
    ) -> ConfluenceScore:
        normalized = {
            self._normalize_timeframe(timeframe): levels
            for timeframe, levels in timeframe_levels.items()
        }

        directions = [levels.trend_direction for levels in normalized.values()]
        dominant_direction = self._dominant_direction(directions)

        rows: list[TimeframeConfluence] = []
        total_weight = 0.0
        weighted_score = 0.0

        for timeframe, weight in self.timeframe_weights.items():
            levels = normalized.get(timeframe)

            if levels is None:
                continue

            direction_score = self._direction_score(
                levels.trend_direction,
                dominant_direction,
            )
            strength_score = max(0.0, min(100.0, levels.trend_strength))
            structure_score = self._structure_score(levels, dominant_direction)
            score = round(
                direction_score * 0.45
                + strength_score * 0.35
                + structure_score * 0.20,
                2,
            )
            contribution = round(score * (weight / 100.0), 2)

            weighted_score += contribution
            total_weight += weight

            rows.append(
                TimeframeConfluence(
                    timeframe=timeframe,
                    weight=weight,
                    trend_direction=levels.trend_direction,
                    trend_strength=levels.trend_strength,
                    score=score,
                    contribution=contribution,
                    status=self._status(score),
                    note=self._note(timeframe, levels, dominant_direction),
                )
            )

        confluence_score = round(
            weighted_score / max(total_weight, 1.0) * 100.0,
            2,
        )

        conflict_detected = len(set(directions)) > 1
        counter_trend = self._counter_trend(normalized, dominant_direction)
        confidence_adjustment = self._confidence_adjustment(
            confluence_score,
            conflict_detected,
            counter_trend,
        )

        base_value = base_confidence.confidence_score if base_confidence else 0.0
        projected = max(0.0, min(100.0, base_value + confidence_adjustment))

        return ConfluenceScore(
            symbol=symbol.upper(),
            primary_timeframe=self._normalize_timeframe(primary_timeframe),
            confluence_score=confluence_score,
            alignment_rating=self._stars(confluence_score),
            alignment_label=self._alignment_label(confluence_score, conflict_detected, counter_trend),
            dominant_direction=dominant_direction,
            conflict_detected=conflict_detected,
            counter_trend=counter_trend,
            confidence_adjustment=round(confidence_adjustment, 2),
            final_confidence_projection=round(projected, 2),
            timeframes=rows,
            narrative=self._narrative(
                confluence_score,
                dominant_direction,
                conflict_detected,
                counter_trend,
                rows,
            ),
        )

    def _normalize_timeframe(self, timeframe: str) -> str:
        value = str(timeframe).strip()
        return self.timeframe_aliases.get(value, self.timeframe_aliases.get(value.lower(), value.lower()))

    def _dominant_direction(self, directions: list[str]) -> str:
        bullish = directions.count("bullish")
        bearish = directions.count("bearish")

        if bullish > bearish:
            return "bullish"
        if bearish > bullish:
            return "bearish"
        return "mixed"

    def _direction_score(self, direction: str, dominant: str) -> float:
        if dominant == "mixed":
            return 55.0
        if direction == dominant:
            return 100.0
        if direction == "neutral":
            return 55.0
        return 20.0

    def _structure_score(self, levels: TechnicalLevels, dominant: str) -> float:
        range_size = max(levels.swing_high - levels.swing_low, 0.01)
        location = (levels.current_price - levels.swing_low) / range_size

        if dominant == "bullish":
            return max(0.0, min(100.0, location * 100.0))
        if dominant == "bearish":
            return max(0.0, min(100.0, (1.0 - location) * 100.0))
        return 50.0

    def _status(self, score: float) -> str:
        if score >= 85:
            return "Aligned"
        if score >= 70:
            return "Supportive"
        if score >= 55:
            return "Mixed"
        return "Conflict"

    def _note(self, timeframe: str, levels: TechnicalLevels, dominant: str) -> str:
        if levels.trend_direction == dominant:
            return f"{timeframe} trend supports the dominant {dominant} direction."
        return f"{timeframe} trend is {levels.trend_direction}, which conflicts with dominant {dominant} context."

    def _counter_trend(self, levels: dict[str, TechnicalLevels], dominant: str) -> bool:
        htf = [levels.get("4h"), levels.get("1d")]
        htf_directions = [row.trend_direction for row in htf if row is not None]

        if not htf_directions or dominant == "mixed":
            return False

        return any(direction not in {dominant, "neutral"} for direction in htf_directions)

    def _confidence_adjustment(
        self,
        confluence_score: float,
        conflict_detected: bool,
        counter_trend: bool,
    ) -> float:
        adjustment = 0.0

        if confluence_score >= 90:
            adjustment += 8
        elif confluence_score >= 80:
            adjustment += 5
        elif confluence_score >= 65:
            adjustment += 2
        elif confluence_score < 50:
            adjustment -= 8

        if conflict_detected:
            adjustment -= 3
        if counter_trend:
            adjustment -= 6

        return adjustment

    def _stars(self, score: float) -> str:
        if score >= 90:
            return "★★★★★"
        if score >= 80:
            return "★★★★☆"
        if score >= 65:
            return "★★★☆☆"
        if score >= 50:
            return "★★☆☆☆"
        return "★☆☆☆☆"

    def _alignment_label(
        self,
        score: float,
        conflict: bool,
        counter_trend: bool,
    ) -> str:
        if counter_trend:
            return "Counter-trend"
        if score >= 90 and not conflict:
            return "Perfect Alignment"
        if score >= 80:
            return "Strong Alignment"
        if score >= 65:
            return "Moderate Alignment"
        if conflict:
            return "Mixed / Conflicted"
        return "Weak Alignment"

    def _narrative(
        self,
        score: float,
        dominant: str,
        conflict: bool,
        counter_trend: bool,
        rows: list[TimeframeConfluence],
    ) -> str:
        aligned = [row.timeframe for row in rows if row.status in {"Aligned", "Supportive"}]
        conflicts = [row.timeframe for row in rows if row.status == "Conflict"]

        text = (
            f"Multi-timeframe confluence is {score:.1f} with dominant {dominant} context. "
            f"Supportive timeframes: {', '.join(aligned) if aligned else 'none'}."
        )

        if conflicts:
            text += f" Conflicting timeframes: {', '.join(conflicts)}."
        if counter_trend:
            text += " Higher-timeframe counter-trend risk is present."
        elif not conflict:
            text += " Timeframes are broadly aligned."

        return text


confluence_engine = ConfluenceEngine()
