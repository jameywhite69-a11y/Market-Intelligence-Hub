from fastapi import APIRouter
from app.models.rule import StrategyRuleGraph
from app.services.rule_engine import default_rule_graph, summarize_graph
from app.services.rule_evaluator import evaluate_rule_graph
from app.services.rule_code_generator import graph_to_json_text, graph_to_pine, graph_to_easylanguage, graph_to_python
from app.services.strategy_library import strategy_templates
from app.services.live_strategy_analyzer import analyze_symbol, analyze_watchlist

router = APIRouter(prefix="/api/rule-engine", tags=["rule-engine"])

@router.get("/default")
def get_default_graph():
    return default_rule_graph()

@router.get("/templates")
def get_templates():
    return strategy_templates()

@router.post("/summary")
def get_summary(graph: StrategyRuleGraph):
    return summarize_graph(graph)

@router.post("/evaluate/{symbol}")
def evaluate(symbol: str, graph: StrategyRuleGraph):
    return evaluate_rule_graph(graph, symbol)

@router.post("/generate")
def generate_from_graph(graph: StrategyRuleGraph):
    return {"json": graph_to_json_text(graph), "pine": graph_to_pine(graph), "easylanguage": graph_to_easylanguage(graph), "python": graph_to_python(graph)}


@router.post("/analyze/{symbol}")
def analyze_single_symbol(symbol: str, graph: StrategyRuleGraph):
    return analyze_symbol(graph, symbol)


@router.post("/analyze-watchlist")
def analyze_symbols(payload: dict):
    graph = StrategyRuleGraph(**payload.get("graph", {}))
    symbols = payload.get("symbols", [])
    return analyze_watchlist(graph, symbols)
