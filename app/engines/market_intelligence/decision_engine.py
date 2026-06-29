from __future__ import annotations
from dataclasses import dataclass
from app.engines.market_intelligence.confidence_score import ConfidenceScore
from app.engines.market_intelligence.decision_score import DecisionFactor, InstitutionalDecision
from app.engines.market_intelligence.strategy_score import StrategyScore
from app.engines.market_intelligence.technical_levels import TechnicalLevels
from app.engines.market_intelligence.trade_plan import TradePlan

@dataclass(slots=True)
class DecisionEngine:
    weights: dict[str, float] | None = None

    def __post_init__(self) -> None:
        if self.weights is None:
            self.weights = {
                "Technical Structure": 25,
                "Strategy Score": 25,
                "Confidence": 20,
                "Risk / Reward": 15,
                "Trend Quality": 10,
                "Market Conditions": 5,
            }

    def decide(self, *, technical: TechnicalLevels, strategy_score: StrategyScore, trade_plan: TradePlan, confidence: ConfidenceScore) -> InstitutionalDecision:
        factors = [
            self._technical_structure(technical),
            self._strategy_score(strategy_score),
            self._confidence(confidence),
            self._risk_reward(trade_plan),
            self._trend_quality(technical),
            self._market_conditions(technical),
        ]
        decision_score = round(sum(f.contribution for f in factors), 2)
        classification = self._classification(decision_score)
        recommendation = self._recommendation(decision_score, trade_plan)
        priority = self._priority(decision_score)
        top_reasons = [f"{f.name}: {f.status}" for f in sorted(factors, key=lambda x: x.score, reverse=True)[:3]]
        concerns = [f"{f.name}: {f.status}" for f in factors if f.score < 60]
        if trade_plan.action == "Avoid":
            concerns.append("Trade plan recommends avoiding this setup.")
        if not concerns:
            concerns = ["No major concerns detected by current engine inputs."]
        explanation = (
            f"{classification}. Recommendation: {recommendation}. "
            f"Trend is {technical.trend_direction}; strategy grade is {strategy_score.grade}; "
            f"confidence is {confidence.confidence_label}; target 2 R:R is {trade_plan.risk_reward_2}. "
            f"Top reasons: {'; '.join(top_reasons)}. Primary concern: {concerns[0]}"
        )
        return InstitutionalDecision(
            decision_score=decision_score,
            classification=classification,
            recommendation=recommendation,
            priority=priority,
            expected_r=trade_plan.expected_r_multiple,
            position_bias=trade_plan.direction,
            factors=factors,
            top_reasons=top_reasons,
            concerns=concerns,
            explanation=explanation,
        )

    def _factor(self, name: str, raw_score: float, status: str, note: str) -> DecisionFactor:
        weight = float(self.weights[name])
        score = max(0.0, min(100.0, raw_score))
        return DecisionFactor(name=name, weight=weight, score=round(score, 2), contribution=round((score / 100) * weight, 2), status=status, note=note)

    def _technical_structure(self, technical: TechnicalLevels) -> DecisionFactor:
        range_size = max(technical.swing_high - technical.swing_low, 0.01)
        location = (technical.current_price - technical.swing_low) / range_size
        if technical.trend_direction == "bullish":
            raw = 45 + location * 50
            status = "Constructive" if location >= 0.55 else "Developing"
        elif technical.trend_direction == "bearish":
            raw = 45 + (1 - location) * 50
            status = "Constructive" if location <= 0.45 else "Developing"
        else:
            raw = 45
            status = "Neutral"
        return self._factor("Technical Structure", raw, status, "Current price location is evaluated against the recent swing range.")

    def _strategy_score(self, strategy_score: StrategyScore) -> DecisionFactor:
        return self._factor("Strategy Score", strategy_score.overall_score, strategy_score.recommendation, f"Strategy model returned grade {strategy_score.grade}.")

    def _confidence(self, confidence: ConfidenceScore) -> DecisionFactor:
        return self._factor("Confidence", confidence.confidence_score, confidence.confidence_label, confidence.summary)

    def _risk_reward(self, trade_plan: TradePlan) -> DecisionFactor:
        raw = min(100, max(20, trade_plan.risk_reward_2 * 25))
        status = "Excellent" if trade_plan.risk_reward_2 >= 4 else "Good" if trade_plan.risk_reward_2 >= 3 else "Marginal"
        return self._factor("Risk / Reward", raw, status, f"Target 2 R:R is {trade_plan.risk_reward_2}.")

    def _trend_quality(self, technical: TechnicalLevels) -> DecisionFactor:
        status = "Strong" if technical.trend_strength >= 75 else "Moderate" if technical.trend_strength >= 55 else "Weak"
        return self._factor("Trend Quality", technical.trend_strength, status, f"Trend direction is {technical.trend_direction}.")

    def _market_conditions(self, technical: TechnicalLevels) -> DecisionFactor:
        atr_pct = technical.atr / max(technical.current_price, 0.01)
        if atr_pct < 0.01:
            raw, status = 55, "Compressed"
        elif atr_pct <= 0.04:
            raw, status = 85, "Healthy"
        else:
            raw, status = 50, "Elevated"
        return self._factor("Market Conditions", raw, status, f"ATR is approximately {atr_pct:.2%} of current price.")

    def _classification(self, score: float) -> str:
        if score >= 90: return "Elite Setup"
        if score >= 80: return "Tradeable"
        if score >= 65: return "Watch"
        if score >= 50: return "Speculative"
        return "Avoid"

    def _recommendation(self, score: float, trade_plan: TradePlan) -> str:
        if score >= 90 and trade_plan.action == "Plan Trade": return "Enter on Confirmation"
        if score >= 80: return "Plan Trade"
        if score >= 65: return "Watch Closely"
        if score >= 50: return "Small Size Only"
        return "Avoid"

    def _priority(self, score: float) -> str:
        if score >= 90: return "Priority 1"
        if score >= 80: return "Priority 2"
        if score >= 65: return "Priority 3"
        if score >= 50: return "Priority 4"
        return "No Priority"

decision_engine = DecisionEngine()
