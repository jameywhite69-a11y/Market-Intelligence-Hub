from app.engines.institutional_intelligence.confluence_engine import confluence_engine
from app.engines.market_intelligence.confidence_score import ConfidenceScore
from app.engines.market_intelligence.technical_levels import TechnicalLevels


def _levels(direction: str, strength: float) -> TechnicalLevels:
    return TechnicalLevels(
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
        trend_direction=direction,
        trend_strength=strength,
        entry_zone_low=100,
        entry_zone_high=101,
        stop_loss=96,
        target_1=108,
        target_2=116,
        risk_reward_1=2,
        risk_reward_2=4,
    )


def test_confluence_engine_scores_alignment():
    base_confidence = ConfidenceScore(
        confidence_score=75,
        confidence_label="Medium",
        decision="Watch Closely",
        factors=[],
        summary="Base confidence.",
    )

    result = confluence_engine.evaluate(
        symbol="TEST",
        primary_timeframe="15m",
        timeframe_levels={
            "5m": _levels("bullish", 70),
            "15m": _levels("bullish", 75),
            "1h": _levels("bullish", 80),
            "4h": _levels("bullish", 85),
            "1d": _levels("bullish", 90),
        },
        base_confidence=base_confidence,
    )

    assert result.confluence_score > 80
    assert result.dominant_direction == "bullish"
    assert result.conflict_detected is False
    assert result.confidence_adjustment > 0
    assert len(result.timeframes) == 5
