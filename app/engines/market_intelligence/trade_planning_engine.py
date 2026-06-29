from __future__ import annotations

from dataclasses import dataclass

from app.engines.market_intelligence.strategy_score import StrategyScore
from app.engines.market_intelligence.technical_levels import TechnicalLevels
from app.engines.market_intelligence.trade_plan import TradePlan


@dataclass(slots=True)
class TradePlanningEngine:
    default_account_size: float = 10000.0
    default_risk_percent: float = 1.0
    max_position_notional_percent: float = 25.0

    def plan(
        self,
        *,
        symbol: str,
        timeframe: str,
        technical: TechnicalLevels,
        strategy_score: StrategyScore,
        account_size: float | None = None,
        risk_percent: float | None = None,
    ) -> TradePlan:
        account = float(account_size or self.default_account_size)
        risk_pct = float(risk_percent or self.default_risk_percent)
        risk_budget = account * (risk_pct / 100)

        direction = "short" if technical.trend_direction == "bearish" else "long"
        action = (
            "Plan Trade"
            if strategy_score.recommendation == "Tradeable"
            else "Prepare / Watch"
            if strategy_score.recommendation == "Watch"
            else "Avoid"
        )

        entry = technical.entry_zone_low if direction == "short" else technical.entry_zone_high
        stop = technical.stop_loss
        target_1 = technical.target_1
        target_2 = technical.target_2
        trailing_stop = (
            min(technical.ema_fast, technical.vwap)
            if direction == "short"
            else max(technical.ema_fast, technical.vwap)
        )

        risk_per_share = abs(entry - stop) or 0.01
        reward_1 = abs(target_1 - entry)
        reward_2 = abs(target_2 - entry)

        position_size = risk_budget / risk_per_share
        max_notional = account * (self.max_position_notional_percent / 100)
        notional = position_size * entry

        if notional > max_notional:
            position_size = max_notional / max(entry, 0.01)
            notional = position_size * entry
            risk_budget = position_size * risk_per_share

        rr1 = reward_1 / risk_per_share
        rr2 = reward_2 / risk_per_share

        win_probability = max(0.35, min(0.72, strategy_score.overall_score / 130))
        average_win = (rr1 + rr2) / 2
        expected_r = (win_probability * average_win) - ((1 - win_probability) * 1.0)

        notes = [
            f"Recommendation derived from strategy score: {strategy_score.recommendation}.",
            f"Risk budget is {risk_pct:.2f}% of account size.",
            "Position size is capped by maximum notional exposure.",
        ]

        if strategy_score.recommendation == "Avoid":
            notes.append("Trade should remain inactive until score improves.")

        return TradePlan(
            symbol=symbol.upper(),
            timeframe=timeframe,
            direction=direction,
            action=action,
            entry_price=round(entry, 4),
            stop_loss=round(stop, 4),
            target_1=round(target_1, 4),
            target_2=round(target_2, 4),
            trailing_stop=round(trailing_stop, 4),
            risk_per_share=round(risk_per_share, 4),
            reward_1=round(reward_1, 4),
            reward_2=round(reward_2, 4),
            risk_reward_1=round(rr1, 2),
            risk_reward_2=round(rr2, 2),
            account_size=round(account, 2),
            risk_percent=round(risk_pct, 2),
            dollar_risk=round(risk_budget, 2),
            position_size=round(position_size, 4),
            notional_value=round(notional, 2),
            max_portfolio_risk_percent=round(self.max_position_notional_percent, 2),
            expected_r_multiple=round(expected_r, 2),
            notes=notes,
        )


trade_planning_engine = TradePlanningEngine()