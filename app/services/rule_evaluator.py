import random
from app.models.rule import StrategyRuleGraph

def evaluate_rule_graph(graph: StrategyRuleGraph, symbol: str) -> dict:
    seed = sum(ord(c) for c in symbol + graph.name + graph.logic)
    random.seed(seed)
    rows = []
    for rule in graph.rules:
        if not rule.enabled:
            rows.append({"id": rule.id, "label": rule.label, "enabled": False, "passed": False, "score": 0, "detail": "Disabled"})
            continue
        score = random.randint(68, 99)
        passed = score >= 76
        rows.append({"id": rule.id, "label": rule.label, "enabled": True, "passed": passed, "score": score, "detail": f"{rule.rule_type} simulated score {score}"})
    active_rows = [r for r in rows if r["enabled"]]
    if not active_rows:
        overall_pass = False
        confidence = 0
    elif graph.logic == "AND":
        overall_pass = all(r["passed"] for r in active_rows)
        confidence = round(sum(r["score"] for r in active_rows) / len(active_rows))
    else:
        overall_pass = any(r["passed"] for r in active_rows)
        confidence = round(sum(r["score"] for r in active_rows) / len(active_rows))
    return {"symbol": symbol, "strategy": graph.name, "logic": graph.logic, "passed": overall_pass, "confidence": confidence, "rules": rows, "signal": "READY" if overall_pass else "WAIT"}
