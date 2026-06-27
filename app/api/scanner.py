from fastapi import APIRouter
from pydantic import BaseModel
from app.models.rule import StrategyRuleGraph
from app.services.institutional_scanner import scan_symbols, scan_multiple_strategies
from app.services.strategy_library import strategy_templates

router = APIRouter(prefix="/api/scanner", tags=["scanner"])


class ScanRequest(BaseModel):
    graph: StrategyRuleGraph
    symbols: list[str]


class MultiStrategyScanRequest(BaseModel):
    symbols: list[str]


@router.post("/scan")
def scan(request: ScanRequest):
    return scan_symbols(request.graph, request.symbols)


@router.post("/scan-templates")
def scan_templates(request: MultiStrategyScanRequest):
    graphs = strategy_templates()
    return scan_multiple_strategies(graphs, request.symbols)
