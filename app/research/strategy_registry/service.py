from __future__ import annotations
from app.research.strategy_registry.models import StrategyDefinition, StrategyLifecycle, StrategyRiskProfile

class StrategyRegistryService:
    def __init__(self) -> None:
        self.strategies = {
            "ema_pullback_pro": StrategyDefinition(
                strategy_id="ema_pullback_pro",
                name="EMA Pullback Professional",
                version="4.2",
                description="Trend-following pullback strategy using EMA alignment, momentum, volume, and reclaim confirmation.",
                lifecycle=StrategyLifecycle.paper_validation,
                risk_profile=StrategyRiskProfile.balanced,
                supported_assets=["Crypto", "Equities", "Futures"],
                supported_timeframes=["5m", "15m", "1h", "4h"],
                deployment_status="Paper Validation",
                health_score=92.0,
                paper_trades=341,
                live_trades=0,
                win_rate=64.8,
                profit_factor=2.14,
                expectancy_r=0.72,
                max_drawdown_percent=6.4,
                notes=["Strongest during trending regimes.", "Requires volume confirmation before deployment."],
            ),
            "vwap_reclaim": StrategyDefinition(
                strategy_id="vwap_reclaim",
                name="VWAP Reclaim",
                version="2.1",
                description="Intraday reclaim strategy using VWAP, momentum recovery, and risk-defined execution.",
                lifecycle=StrategyLifecycle.research,
                risk_profile=StrategyRiskProfile.conservative,
                supported_assets=["Equities", "Futures"],
                supported_timeframes=["1m", "5m", "15m"],
                deployment_status="Research Only",
                health_score=86.0,
                paper_trades=118,
                win_rate=61.2,
                profit_factor=1.86,
                expectancy_r=0.48,
                max_drawdown_percent=4.9,
                notes=["Best suited for liquid intraday symbols."],
            ),
            "crypto_momentum": StrategyDefinition(
                strategy_id="crypto_momentum",
                name="Crypto Momentum",
                version="1.6",
                description="Momentum continuation model for highly liquid crypto assets.",
                lifecycle=StrategyLifecycle.backtest,
                risk_profile=StrategyRiskProfile.aggressive,
                supported_assets=["Crypto"],
                supported_timeframes=["15m", "1h", "4h"],
                deployment_status="Backtest",
                health_score=79.0,
                paper_trades=74,
                win_rate=57.5,
                profit_factor=1.62,
                expectancy_r=0.39,
                max_drawdown_percent=9.8,
                notes=["Requires portfolio heat and crypto correlation controls."],
            ),
        }

    def list_strategies(self) -> dict:
        return {"strategies": [s.model_dump() for s in self.strategies.values()], "count": len(self.strategies)}

    def get_strategy(self, strategy_id: str) -> dict:
        strategy = self.strategies.get(strategy_id)
        return strategy.model_dump() if strategy else {"error": f"Strategy not found: {strategy_id}"}

    def health_summary(self) -> dict:
        rows = list(self.strategies.values())
        avg = sum(r.health_score for r in rows) / len(rows) if rows else 0
        deployable = [r for r in rows if r.lifecycle in {StrategyLifecycle.paper_validation, StrategyLifecycle.live_candidate, StrategyLifecycle.production}]
        return {
            "strategy_count": len(rows),
            "average_health": round(avg, 2),
            "deployable_count": len(deployable),
            "top_strategy": max(rows, key=lambda r: r.health_score).model_dump() if rows else None,
        }

strategy_registry_service = StrategyRegistryService()
