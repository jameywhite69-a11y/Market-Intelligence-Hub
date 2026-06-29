from app.engines.institutional_intelligence.strategy_engine import institutional_strategy_engine
from app.engines.market_intelligence.technical_levels import TechnicalLevels
from app.engines.market_intelligence.trade_plan import TradePlan


def test_institutional_strategy_engine_returns_matrix():
    levels = TechnicalLevels(
        current_price=100,
        atr=2,
        swing_high=104,
        swing_low=94,
        support_1=96,
        support_2=92,
        resistance_1=104,
        resistance_2=108,
        pivot=100,
        vwap=98,
        ema_fast=101,
        ema_slow=97,
        trend_direction="bullish",
        trend_strength=70,
        entry_zone_low=100,
        entry_zone_high=101,
        stop_loss=96,
        target_1=108,
        target_2=116,
        risk_reward_1=2,
        risk_reward_2=4,
    )

    plan = TradePlan(
        symbol="TEST",
        timeframe="15m",
        direction="long",
        action="Plan Trade",
        entry_price=101,
        stop_loss=96,
        target_1=108,
        target_2=116,
        trailing_stop=99,
        risk_per_share=5,
        reward_1=7,
        reward_2=15,
        risk_reward_1=1.4,
        risk_reward_2=3,
        account_size=10000,
        risk_percent=1,
        dollar_risk=100,
        position_size=20,
        notional_value=2020,
        max_portfolio_risk_percent=25,
        expected_r_multiple=2,
        notes=[],
    )

    matrix = institutional_strategy_engine.evaluate(
        technical=levels,
        trade_plan=plan,
        confluence=None,
    )

    assert matrix.primary_strategy
    assert matrix.best_score > 0
    assert len(matrix.candidates) == 7
    assert matrix.narrative
