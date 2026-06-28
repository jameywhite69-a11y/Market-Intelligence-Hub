from __future__ import annotations

from dataclasses import dataclass

from app.engines.market_intelligence.technical_levels import TechnicalLevels
from app.models.series import PriceSeries


@dataclass(slots=True)
class TechnicalEngine:
    atr_length: int = 14
    fast_ema_length: int = 20
    slow_ema_length: int = 50
    swing_lookback: int = 20

    def analyze(self, series: PriceSeries) -> TechnicalLevels:
        closes = list(series.close)
        highs = list(series.high)
        lows = list(series.low)
        volumes = list(series.volume)

        if not closes:
            raise ValueError("PriceSeries must contain at least one close value.")

        current = float(closes[-1])
        atr = self._atr(highs, lows, closes, self.atr_length)
        swing_high = max(highs[-self.swing_lookback:]) if highs else current
        swing_low = min(lows[-self.swing_lookback:]) if lows else current
        pivot = (swing_high + swing_low + current) / 3

        support_1 = (2 * pivot) - swing_high
        resistance_1 = (2 * pivot) - swing_low
        support_2 = pivot - (swing_high - swing_low)
        resistance_2 = pivot + (swing_high - swing_low)

        vwap = self._vwap(highs, lows, closes, volumes)
        ema_fast = self._ema(closes, self.fast_ema_length)
        ema_slow = self._ema(closes, self.slow_ema_length)

        trend_direction = "bullish" if ema_fast > ema_slow else "bearish" if ema_fast < ema_slow else "neutral"
        trend_strength = min(100.0, abs(ema_fast - ema_slow) / max(atr, 0.01) * 25.0)

        if trend_direction == "bullish":
            entry_low = max(vwap, ema_fast)
            entry_high = current + atr * 0.25
            stop = min(swing_low, current - atr * 1.5)
            target_1 = current + atr * 2
            target_2 = current + atr * 4
        elif trend_direction == "bearish":
            entry_low = current - atr * 0.25
            entry_high = min(vwap, ema_fast)
            stop = max(swing_high, current + atr * 1.5)
            target_1 = current - atr * 2
            target_2 = current - atr * 4
        else:
            entry_low = current - atr * 0.25
            entry_high = current + atr * 0.25
            stop = current - atr
            target_1 = current + atr
            target_2 = current + atr * 2

        risk = abs(current - stop) or 0.01
        rr1 = abs(target_1 - current) / risk
        rr2 = abs(target_2 - current) / risk

        return TechnicalLevels(
            current_price=round(current, 4),
            atr=round(atr, 4),
            swing_high=round(float(swing_high), 4),
            swing_low=round(float(swing_low), 4),
            support_1=round(float(support_1), 4),
            support_2=round(float(support_2), 4),
            resistance_1=round(float(resistance_1), 4),
            resistance_2=round(float(resistance_2), 4),
            pivot=round(float(pivot), 4),
            vwap=round(float(vwap), 4),
            ema_fast=round(float(ema_fast), 4),
            ema_slow=round(float(ema_slow), 4),
            trend_direction=trend_direction,
            trend_strength=round(trend_strength, 2),
            entry_zone_low=round(float(min(entry_low, entry_high)), 4),
            entry_zone_high=round(float(max(entry_low, entry_high)), 4),
            stop_loss=round(float(stop), 4),
            target_1=round(float(target_1), 4),
            target_2=round(float(target_2), 4),
            risk_reward_1=round(float(rr1), 2),
            risk_reward_2=round(float(rr2), 2),
        )

    def _atr(self, highs: list[float], lows: list[float], closes: list[float], length: int) -> float:
        if not highs or not lows or not closes:
            return 0.01

        true_ranges: list[float] = []

        for idx in range(len(closes)):
            high = float(highs[idx])
            low = float(lows[idx])

            if idx == 0:
                true_ranges.append(high - low)
                continue

            previous_close = float(closes[idx - 1])
            true_ranges.append(
                max(
                    high - low,
                    abs(high - previous_close),
                    abs(low - previous_close),
                )
            )

        window = true_ranges[-length:] if len(true_ranges) >= length else true_ranges
        return sum(window) / max(len(window), 1)

    def _ema(self, values: list[float], length: int) -> float:
        if not values:
            return 0.0

        multiplier = 2 / (length + 1)
        ema = float(values[0])

        for value in values[1:]:
            ema = (float(value) - ema) * multiplier + ema

        return ema

    def _vwap(self, highs: list[float], lows: list[float], closes: list[float], volumes: list[float]) -> float:
        total_volume = sum(float(volume) for volume in volumes)

        if total_volume <= 0:
            return float(closes[-1])

        weighted = 0.0

        for high, low, close, volume in zip(highs, lows, closes, volumes):
            typical = (float(high) + float(low) + float(close)) / 3
            weighted += typical * float(volume)

        return weighted / total_volume


technical_engine = TechnicalEngine()
