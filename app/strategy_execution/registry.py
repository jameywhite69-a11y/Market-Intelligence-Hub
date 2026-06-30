from __future__ import annotations
from app.strategy_execution.models import StrategyDefinition

class StrategyRegistry:
    def __init__(self) -> None:
        self.strategies = {
            "momentum_a_plus": StrategyDefinition(
                strategy_id="momentum_a_plus",
                name="Momentum A+",
                description="Trades high-scoring scanner opportunities with trend and confidence support.",
                min_score=80.0,
                min_confidence=65.0,
                risk_percent=1.0,
            ),
            "watchlist_pullback": StrategyDefinition(
                strategy_id="watchlist_pullback",
                name="Watchlist Pullback",
                description="Watches ranked opportunities until confirmation improves.",
                min_score=65.0,
                min_confidence=50.0,
                risk_percent=0.5,
            ),
        }

    def list_strategies(self) -> list[dict]:
        return [strategy.model_dump() for strategy in self.strategies.values()]

    def get(self, strategy_id: str) -> StrategyDefinition:
        if strategy_id not in self.strategies:
            raise KeyError(f"Unknown strategy: {strategy_id}")
        return self.strategies[strategy_id]

    def best_for_score(self, score: float) -> StrategyDefinition:
        if score >= 80:
            return self.strategies["momentum_a_plus"]
        return self.strategies["watchlist_pullback"]

strategy_registry = StrategyRegistry()
