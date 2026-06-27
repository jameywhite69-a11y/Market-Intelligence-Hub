from app.models.rule import StrategyRuleGraph
from app.services.live_strategy_analyzer import analyze_symbol


def build_trade_plan(graph: StrategyRuleGraph, symbol: str, account: float = 300000, risk_pct: float = 1.0, price: float | None = None) -> dict:
    analysis = analyze_symbol(graph, symbol)
    last = price or (100 + (sum(ord(c) for c in symbol) % 280))
    risk_dollars = account * (risk_pct / 100)
    stop = round(last * 0.98, 2)
    target1 = round(last * 1.02, 2)
    target2 = round(last * 1.04, 2)
    runner = round(last * 1.08, 2)
    per_share_risk = max(0.01, last - stop)
    qty = int(risk_dollars / per_share_risk)
    reward_to_target2 = target2 - last
    rr = round(reward_to_target2 / per_share_risk, 2)

    return {
        "symbol": symbol,
        "strategy": graph.name,
        "signal": analysis["signal"],
        "grade": analysis["grade"],
        "confidence": analysis["confidence"],
        "entry": round(last, 2),
        "stop": stop,
        "target1": target1,
        "target2": target2,
        "runner": runner,
        "account": account,
        "risk_pct": risk_pct,
        "risk_dollars": round(risk_dollars, 2),
        "qty": qty,
        "position_value": round(qty * last, 2),
        "rr": rr,
        "status": "ACTIONABLE" if analysis["passed"] else "WATCH",
        "coach_note": analysis["coach_note"],
    }


def build_trade_queue(graph: StrategyRuleGraph, symbols: list[str], account: float = 300000, risk_pct: float = 1.0) -> list[dict]:
    plans = [build_trade_plan(graph, s, account, risk_pct) for s in symbols]
    return sorted(plans, key=lambda p: (p["status"] == "ACTIONABLE", p["confidence"], p["rr"]), reverse=True)


def portfolio_exposure(positions: list[dict]) -> dict:
    total_value = sum(float(p.get("position_value", p.get("qty", 0) * p.get("entry", 0))) for p in positions)
    by_symbol = {}
    by_strategy = {}
    for p in positions:
        symbol = p.get("symbol", "UNKNOWN")
        strategy = p.get("strategy", "Manual")
        value = float(p.get("position_value", p.get("qty", 0) * p.get("entry", 0)))
        by_symbol[symbol] = by_symbol.get(symbol, 0) + value
        by_strategy[strategy] = by_strategy.get(strategy, 0) + value

    return {
        "total_value": round(total_value, 2),
        "by_symbol": [{"symbol": k, "value": round(v, 2)} for k, v in sorted(by_symbol.items(), key=lambda x: x[1], reverse=True)],
        "by_strategy": [{"strategy": k, "value": round(v, 2)} for k, v in sorted(by_strategy.items(), key=lambda x: x[1], reverse=True)],
    }
