from app.models.rule import StrategyRuleGraph
from app.services.rule_evaluator import evaluate_rule_graph


def analyze_symbol(graph: StrategyRuleGraph, symbol: str) -> dict:
    result = evaluate_rule_graph(graph, symbol)
    passed_rules = [r for r in result["rules"] if r["enabled"] and r["passed"]]
    active_rules = [r for r in result["rules"] if r["enabled"]]

    if not active_rules:
        grade = "N/A"
    elif result["confidence"] >= 92 and result["passed"]:
        grade = "A+"
    elif result["confidence"] >= 85 and result["passed"]:
        grade = "A"
    elif result["confidence"] >= 78:
        grade = "B"
    else:
        grade = "WAIT"

    return {
        **result,
        "grade": grade,
        "passed_count": len(passed_rules),
        "active_count": len(active_rules),
        "readiness_text": f"{len(passed_rules)}/{len(active_rules)} rules passed",
        "coach_note": (
            "High-quality setup. Confirm liquidity and risk before execution."
            if result["passed"] else
            "Not ready. Wait for rule confirmation or reduce risk."
        ),
    }


def analyze_watchlist(graph: StrategyRuleGraph, symbols: list[str]) -> list[dict]:
    rows = [analyze_symbol(graph, symbol) for symbol in symbols]
    return sorted(rows, key=lambda r: (r["passed"], r["confidence"]), reverse=True)
