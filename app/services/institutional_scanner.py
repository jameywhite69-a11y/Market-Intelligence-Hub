from app.models.rule import StrategyRuleGraph
from app.services.live_strategy_analyzer import analyze_symbol


def scan_symbols(graph: StrategyRuleGraph, symbols: list[str]) -> dict:
    rows = [analyze_symbol(graph, symbol) for symbol in symbols]
    rows = sorted(rows, key=lambda r: (r["passed"], r["confidence"]), reverse=True)

    opportunity_queue = []
    for rank, row in enumerate(rows, start=1):
        opportunity_queue.append({
            "rank": rank,
            "symbol": row["symbol"],
            "strategy": row["strategy"],
            "grade": row["grade"],
            "confidence": row["confidence"],
            "signal": row["signal"],
            "readiness_text": row["readiness_text"],
            "coach_note": row["coach_note"],
        })

    heatmap = [
        {
            "symbol": row["symbol"],
            "confidence": row["confidence"],
            "grade": row["grade"],
            "signal": row["signal"],
            "intensity": min(100, max(0, row["confidence"])),
        }
        for row in rows
    ]

    return {
        "strategy": graph.name,
        "logic": graph.logic,
        "count": len(rows),
        "rows": rows,
        "opportunity_queue": opportunity_queue,
        "heatmap": heatmap,
        "auto_sorted_symbols": [row["symbol"] for row in rows],
    }


def scan_multiple_strategies(graphs: list[StrategyRuleGraph], symbols: list[str]) -> dict:
    return {
        "symbols": symbols,
        "strategy_results": [
            scan_symbols(graph, symbols) for graph in graphs
        ],
    }
