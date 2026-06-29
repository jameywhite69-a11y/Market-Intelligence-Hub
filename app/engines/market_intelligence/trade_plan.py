from __future__ import annotations

from pydantic import BaseModel


class TradePlan(BaseModel):
    symbol: str
    timeframe: str
    direction: str
    action: str
    entry_price: float
    stop_loss: float
    target_1: float
    target_2: float
    trailing_stop: float
    risk_per_share: float
    reward_1: float
    reward_2: float
    risk_reward_1: float
    risk_reward_2: float
    account_size: float
    risk_percent: float
    dollar_risk: float
    position_size: float
    notional_value: float
    max_portfolio_risk_percent: float
    expected_r_multiple: float
    notes: list[str]