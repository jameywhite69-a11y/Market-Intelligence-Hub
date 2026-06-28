from app.engines.market_intelligence.scoring_engine import strategy_scoring_engine
from app.engines.market_intelligence.technical_levels import TechnicalLevels


def test_strategy_scoring_engine_returns_components():
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

    score = strategy_scoring_engine.score(levels)

    assert score.overall_score > 0
    assert score.grade in {"A+", "A", "B", "C", "D"}
    assert len(score.components) == 7
    assert sum(component.contribution for component in score.components) > 0
