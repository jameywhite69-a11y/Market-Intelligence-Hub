from __future__ import annotations

from pydantic import BaseModel


class TechnicalLevels(BaseModel):
    current_price: float
    atr: float
    swing_high: float
    swing_low: float
    support_1: float
    support_2: float
    resistance_1: float
    resistance_2: float
    pivot: float
    vwap: float
    ema_fast: float
    ema_slow: float
    trend_direction: str
    trend_strength: float
    entry_zone_low: float
    entry_zone_high: float
    stop_loss: float
    target_1: float
    target_2: float
    risk_reward_1: float
    risk_reward_2: float
