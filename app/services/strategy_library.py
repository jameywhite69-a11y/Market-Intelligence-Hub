from app.services.rule_engine import default_rule_graph
from app.models.rule import StrategyRuleGraph, StrategyRule


def strategy_templates() -> list[StrategyRuleGraph]:
    base = default_rule_graph()

    vwap = StrategyRuleGraph(
        name="VWAP Reclaim",
        logic="AND",
        direction="Long Only",
        timeframe="15m",
        rules=[
            StrategyRule(id="vwap_reclaim", rule_type="VWAP", label="Price > VWAP", operator=">", value="VWAP"),
            StrategyRule(id="rsi_recovery", rule_type="RSI", label="RSI > 55", operator=">", value=55),
            StrategyRule(id="rvol", rule_type="RVOL", label="RVOL > 1.5", operator=">", value=1.5),
            StrategyRule(id="bull_candle", rule_type="CANDLE", label="Bullish candle", operator="bullish"),
        ],
    )

    breakout = StrategyRuleGraph(
        name="Momentum Breakout",
        logic="AND",
        direction="Long Only",
        timeframe="5m",
        rules=[
            StrategyRule(id="ema_trend", rule_type="EMA", label="EMA29 > EMA54", operator=">"),
            StrategyRule(id="adx", rule_type="ADX", label="ADX > 20", operator=">", value=20),
            StrategyRule(id="candle", rule_type="CANDLE", label="Bullish candle", operator="bullish"),
            StrategyRule(id="rvol", rule_type="RVOL", label="RVOL > 2.0", operator=">", value=2.0),
        ],
    )

    scalping = StrategyRuleGraph(
        name="5-15m Scalping Trend",
        logic="AND",
        direction="Long / Short",
        timeframe="5m",
        rules=[
            StrategyRule(id="ema_trend", rule_type="EMA", label="EMA29 > EMA54", operator=">"),
            StrategyRule(id="adx", rule_type="ADX", label="ADX > 16", operator=">", value=16),
            StrategyRule(id="rsi", rule_type="RSI", label="RSI > 55", operator=">", value=55),
            StrategyRule(id="rvol", rule_type="RVOL", label="Volume confirmation", operator=">", value=1.2),
        ],
    )

    crypto_swing = StrategyRuleGraph(
        name="Crypto Swing Pullback",
        logic="AND",
        direction="Long Only",
        timeframe="1h",
        rules=[
            StrategyRule(id="ema_trend", rule_type="EMA", label="EMA29 > EMA54", operator=">"),
            StrategyRule(id="vwap", rule_type="VWAP", label="Price > VWAP", operator=">", value="VWAP"),
            StrategyRule(id="adx", rule_type="ADX", label="ADX > 18", operator=">", value=18),
            StrategyRule(id="rvol", rule_type="RVOL", label="RVOL > 1.3", operator=">", value=1.3),
            StrategyRule(id="reclaim", rule_type="PRICE", label="Pullback reclaim", operator="reclaim"),
        ],
    )

    mean_reversion = StrategyRuleGraph(
        name="Mean Reversion Bounce",
        logic="AND",
        direction="Long Only",
        timeframe="15m",
        rules=[
            StrategyRule(id="rsi_low", rule_type="RSI", label="RSI recovery > 40", operator=">", value=40),
            StrategyRule(id="vwap_reclaim", rule_type="VWAP", label="VWAP reclaim", operator=">", value="VWAP"),
            StrategyRule(id="candle", rule_type="CANDLE", label="Bullish reversal candle", operator="bullish"),
        ],
    )

    return [base, vwap, breakout, scalping, crypto_swing, mean_reversion]
