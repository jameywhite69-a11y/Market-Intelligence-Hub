from __future__ import annotations

from dataclasses import dataclass

from app.engines.institutional_intelligence.confluence_score import ConfluenceScore
from app.engines.institutional_intelligence.strategy_matrix import StrategyMatrix
from app.engines.market_intelligence.decision_score import InstitutionalDecision
from app.engines.market_intelligence.trade_plan import TradePlan
from app.engines.portfolio_intelligence.portfolio_intelligence import (
    PortfolioExposure,
    PortfolioIntelligence,
)


@dataclass(slots=True)
class PortfolioIntelligenceEngine:
    max_daily_risk_percent: float = 5.0
    max_single_trade_risk_percent: float = 1.0

    def evaluate(
        self,
        *,
        symbol: str,
        timeframe: str,
        decision: InstitutionalDecision,
        trade_plan: TradePlan,
        confluence: ConfluenceScore | None,
        strategy_matrix: StrategyMatrix | None,
    ) -> PortfolioIntelligence:
        asset_class = self._asset_class(symbol)
        base_heat = self._portfolio_heat(decision, trade_plan)
        correlation_risk = self._correlation_risk(asset_class, confluence)
        exposure_risk = self._exposure_risk(asset_class)
        fit_score = self._portfolio_fit_score(
            decision_score=decision.decision_score,
            expected_r=trade_plan.expected_r_multiple,
            correlation_risk=correlation_risk,
            exposure_risk=exposure_risk,
            strategy_matrix=strategy_matrix,
        )

        recommended_size = self._position_size(fit_score, trade_plan)
        action = self._action(fit_score, recommended_size, decision)
        warnings = self._warnings(fit_score, correlation_risk, exposure_risk, trade_plan)

        return PortfolioIntelligence(
            symbol=symbol.upper(),
            timeframe=timeframe,
            portfolio_heat=round(base_heat, 2),
            risk_budget_remaining=round(max(0.0, 100.0 - base_heat), 2),
            correlation_risk=correlation_risk,
            exposure_risk=exposure_risk,
            recommended_position_size=recommended_size,
            portfolio_action=action,
            portfolio_fit_score=round(fit_score, 2),
            exposures=[
                PortfolioExposure(
                    asset_class=asset_class,
                    exposure_percent=self._mock_exposure(asset_class),
                    note="Demo exposure model active until live portfolio positions are connected.",
                )
            ],
            warnings=warnings,
            narrative=self._narrative(action, recommended_size, correlation_risk, exposure_risk, fit_score),
        )

    def _asset_class(self, symbol: str) -> str:
        value = symbol.upper()
        crypto_roots = ["BTC", "ETH", "SOL", "AVAX", "LINK", "DOGE", "XRP", "BNB", "ADA", "DOT"]
        futures_roots = ["ES", "NQ", "YM", "RTY", "CL", "GC"]

        if any(value.startswith(root) for root in crypto_roots):
            return "Crypto"
        if any(value.startswith(root) for root in futures_roots):
            return "Futures"
        if value in {"SPY", "QQQ", "IWM", "DIA"}:
            return "ETF"
        return "Equity"

    def _mock_exposure(self, asset_class: str) -> float:
        defaults = {
            "Crypto": 34.0,
            "Futures": 22.0,
            "ETF": 28.0,
            "Equity": 41.0,
        }
        return defaults.get(asset_class, 25.0)

    def _portfolio_heat(self, decision: InstitutionalDecision, trade_plan: TradePlan) -> float:
        risk_component = min(100.0, max(0.0, trade_plan.risk_percent * 20.0))
        conviction_component = max(0.0, decision.decision_score - 50.0) * 0.80
        return min(100.0, risk_component + conviction_component)

    def _correlation_risk(self, asset_class: str, confluence: ConfluenceScore | None) -> str:
        if asset_class == "Crypto":
            return "Medium"
        if confluence and confluence.counter_trend:
            return "Elevated"
        return "Low"

    def _exposure_risk(self, asset_class: str) -> str:
        exposure = self._mock_exposure(asset_class)
        if exposure >= 60:
            return "Elevated"
        if exposure >= 35:
            return "Moderate"
        return "Low"

    def _portfolio_fit_score(
        self,
        *,
        decision_score: float,
        expected_r: float,
        correlation_risk: str,
        exposure_risk: str,
        strategy_matrix: StrategyMatrix | None,
    ) -> float:
        rr_score = min(100.0, max(0.0, expected_r * 25.0))
        strategy_score = strategy_matrix.best_score if strategy_matrix else 65.0

        score = decision_score * 0.45 + rr_score * 0.25 + strategy_score * 0.30

        if correlation_risk == "Medium":
            score -= 6
        elif correlation_risk == "Elevated":
            score -= 14

        if exposure_risk == "Moderate":
            score -= 5
        elif exposure_risk == "Elevated":
            score -= 12

        return max(0.0, min(100.0, score))

    def _position_size(self, fit_score: float, trade_plan: TradePlan) -> str:
        if fit_score >= 85 and trade_plan.expected_r_multiple >= 1:
            return "Full Position"
        if fit_score >= 70:
            return "Half Position"
        if fit_score >= 55:
            return "Quarter Position"
        return "No New Position"

    def _action(
        self,
        fit_score: float,
        recommended_size: str,
        decision: InstitutionalDecision,
    ) -> str:
        if recommended_size == "No New Position" or decision.recommendation == "Avoid":
            return "Reject"
        if fit_score >= 85:
            return "Accept"
        if fit_score >= 70:
            return "Accept Reduced Size"
        return "Watch Only"

    def _warnings(
        self,
        fit_score: float,
        correlation_risk: str,
        exposure_risk: str,
        trade_plan: TradePlan,
    ) -> list[str]:
        warnings: list[str] = []

        if correlation_risk != "Low":
            warnings.append(f"Correlation risk is {correlation_risk.lower()}.")

        if exposure_risk != "Low":
            warnings.append(f"Exposure risk is {exposure_risk.lower()}.")

        if trade_plan.expected_r_multiple < 1:
            warnings.append("Expected R is below preferred portfolio threshold.")

        if fit_score < 55:
            warnings.append("Portfolio fit score is weak.")

        return warnings or ["No major portfolio warnings detected by current model."]

    def _narrative(
        self,
        action: str,
        recommended_size: str,
        correlation_risk: str,
        exposure_risk: str,
        fit_score: float,
    ) -> str:
        return (
            f"Portfolio action: {action}. Recommended size: {recommended_size}. "
            f"Portfolio fit score is {fit_score:.1f}. "
            f"Correlation risk is {correlation_risk.lower()} and exposure risk is {exposure_risk.lower()}."
        )


portfolio_intelligence_engine = PortfolioIntelligenceEngine()
