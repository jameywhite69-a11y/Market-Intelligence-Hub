from app.models.rule import StrategyRuleGraph
from app.services.institutional_scanner import scan_symbols


class ScannerEngine:
    def scan(self, graph: StrategyRuleGraph, symbols: list[str]) -> dict:
        return scan_symbols(graph, symbols)


scanner_engine = ScannerEngine()
