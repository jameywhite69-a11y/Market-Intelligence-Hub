from app.models.rule import StrategyRule, StrategyRuleGraph

def default_rule_graph() -> StrategyRuleGraph:
    return StrategyRuleGraph(
        name="EMA 29/54 + ADX + RVOL Pullback",
        logic="AND",
        direction="Long Only",
        timeframe="15m",
        rules=[
            StrategyRule(id="ema_trend", rule_type="EMA", label="EMA29 > EMA54", left="EMA29", operator=">", right="EMA54", params={"fast": 29, "slow": 54}),
            StrategyRule(id="adx_active", rule_type="ADX", label="ADX > 16", operator=">", value=16, params={"length": 14}),
            StrategyRule(id="rvol_confirm", rule_type="RVOL", label="RVOL > 1.5", operator=">", value=1.5, params={"length": 20}),
            StrategyRule(id="pullback_reclaim", rule_type="PRICE", label="Pullback reclaim", operator="reclaim", params={"reference": "EMA29"}),
        ],
    )

def enabled_rules(graph: StrategyRuleGraph):
    return [rule for rule in graph.rules if rule.enabled]

def summarize_graph(graph: StrategyRuleGraph) -> dict:
    active = enabled_rules(graph)
    return {
        "name": graph.name,
        "logic": graph.logic,
        "direction": graph.direction,
        "timeframe": graph.timeframe,
        "active_rules": len(active),
        "total_rules": len(graph.rules),
        "labels": [rule.label for rule in active],
    }
