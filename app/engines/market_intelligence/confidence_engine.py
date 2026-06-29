from __future__ import annotations
from dataclasses import dataclass
from app.engines.market_intelligence.confidence_score import ConfidenceFactor, ConfidenceScore
from app.engines.market_intelligence.strategy_score import StrategyScore
from app.engines.market_intelligence.technical_levels import TechnicalLevels
from app.engines.market_intelligence.trade_plan import TradePlan

@dataclass(slots=True)
class ConfidenceEngine:
    def evaluate(self, *, technical: TechnicalLevels, strategy_score: StrategyScore, trade_plan: TradePlan) -> ConfidenceScore:
        factors = [
            self._factor("Trend Quality", min(100, max(25, technical.trend_strength)), 
                         "Strong" if technical.trend_strength >= 75 else "Moderate" if technical.trend_strength >= 55 else "Weak",
                         f"Trend is {technical.trend_direction} with strength {technical.trend_strength}."),
            self._factor("Strategy Score", strategy_score.overall_score, strategy_score.recommendation,
                         f"Strategy grade {strategy_score.grade} with {strategy_score.confidence} confidence."),
            self._factor("Risk / Reward", min(100, max(20, trade_plan.risk_reward_2 * 25)),
                         "Favorable" if trade_plan.risk_reward_2 >= 3 else "Acceptable" if trade_plan.risk_reward_2 >= 2 else "Poor",
                         f"Target 2 risk/reward is {trade_plan.risk_reward_2}."),
            self._volatility_factor(technical),
            self._factor("Execution Readiness",
                         85 if trade_plan.action == "Plan Trade" else 65 if trade_plan.action == "Prepare / Watch" else 35,
                         "Actionable" if trade_plan.action == "Plan Trade" else "Watch" if trade_plan.action == "Prepare / Watch" else "Avoid",
                         f"Trade planning action is {trade_plan.action}."),
        ]
        score = round(sum(f.score for f in factors) / len(factors), 2)
        label = "High" if score >= 80 else "Medium" if score >= 65 else "Low"
        decision = "Actionable" if score >= 80 and strategy_score.recommendation == "Tradeable" else "Watch Closely" if score >= 65 and trade_plan.action != "Avoid" else "Avoid"
        strongest = max(factors, key=lambda f: f.score)
        weakest = min(factors, key=lambda f: f.score)
        summary = f"{label} confidence. Decision: {decision}. Strongest factor is {strongest.name}; weakest factor is {weakest.name}."
        return ConfidenceScore(confidence_score=score, confidence_label=label, decision=decision, factors=factors, summary=summary)

    def _factor(self, name: str, score: float, status: str, note: str) -> ConfidenceFactor:
        return ConfidenceFactor(name=name, score=round(max(0, min(100, score)), 2), status=status, note=note)

    def _volatility_factor(self, technical: TechnicalLevels) -> ConfidenceFactor:
        atr_pct = technical.atr / max(technical.current_price, 0.01)
        if atr_pct < 0.01:
            return self._factor("Volatility", 55, "Compressed", f"ATR is approximately {atr_pct:.2%} of current price.")
        if atr_pct <= 0.04:
            return self._factor("Volatility", 85, "Healthy", f"ATR is approximately {atr_pct:.2%} of current price.")
        return self._factor("Volatility", 50, "Elevated", f"ATR is approximately {atr_pct:.2%} of current price.")

confidence_engine = ConfidenceEngine()
