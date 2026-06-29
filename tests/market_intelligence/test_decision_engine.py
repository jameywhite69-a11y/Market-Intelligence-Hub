from app.engines.market_intelligence.confidence_engine import confidence_engine
from app.engines.market_intelligence.decision_engine import decision_engine
from app.engines.market_intelligence.scoring_engine import strategy_scoring_engine
from app.engines.market_intelligence.technical_levels import TechnicalLevels
from app.engines.market_intelligence.trade_planning_engine import trade_planning_engine

def test_decision_engine_returns_institutional_decision():
    levels = TechnicalLevels(
        current_price=100, atr=2, swing_high=104, swing_low=94,
        support_1=96, support_2=92, resistance_1=104, resistance_2=108,
        pivot=100, vwap=98, ema_fast=101, ema_slow=97,
        trend_direction="bullish", trend_strength=70,
        entry_zone_low=100, entry_zone_high=101, stop_loss=96,
        target_1=108, target_2=116, risk_reward_1=2, risk_reward_2=4,
    )
    score = strategy_scoring_engine.score(levels)
    plan = trade_planning_engine.plan(symbol="TEST", timeframe="15m", technical=levels, strategy_score=score)
    confidence = confidence_engine.evaluate(technical=levels, strategy_score=score, trade_plan=plan)
    decision = decision_engine.decide(technical=levels, strategy_score=score, trade_plan=plan, confidence=confidence)
    assert decision.decision_score > 0
    assert decision.classification in {"Elite Setup", "Tradeable", "Watch", "Speculative", "Avoid"}
    assert decision.recommendation
    assert len(decision.factors) == 6
    assert decision.explanation
