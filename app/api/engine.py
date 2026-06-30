from __future__ import annotations
from app.ai_decision.models import AIDecisionNarrative, DecisionFactor

class AIDecisionEngine:
    def analyze(self, context: dict) -> dict:
        opportunity = context.get("selectedOpportunity") or context.get("opportunity") or context
        symbol = str(opportunity.get("symbol") or context.get("symbol") or "UNKNOWN").upper()
        timeframe = str(opportunity.get("timeframe") or context.get("timeframe") or "15m")
        score = float(opportunity.get("score") or opportunity.get("overall_score") or 0)
        expected_r = float(opportunity.get("expectedR") or opportunity.get("expected_r") or 0)
        confidence_raw = opportunity.get("confidence") or opportunity.get("confidence_label") or "Medium"

        if isinstance(confidence_raw, (int, float)):
            confidence_score = float(confidence_raw)
            confidence_label = "High" if confidence_score >= 75 else "Medium" if confidence_score >= 50 else "Low"
        else:
            confidence_label = str(confidence_raw)
            confidence_score = {"High": 82.0, "Medium": 62.0, "Low": 42.0}.get(confidence_label, 62.0)

        decision_score = round((score * 0.55) + (confidence_score * 0.30) + (min(expected_r, 3.0) / 3.0 * 100 * 0.15), 2)

        if decision_score >= 80 and expected_r >= 1.2:
            recommendation = "Execution Ready"
            decision = "Approved for paper execution"
        elif decision_score >= 65:
            recommendation = "Watch Closely"
            decision = "Wait for confirmation"
        else:
            recommendation = "Avoid"
            decision = "Do not execute"

        factors = [
            DecisionFactor(name="Opportunity Score", score=score, status="Strong" if score >= 80 else "Developing" if score >= 65 else "Weak", explanation=f"Scanner score is {score:.1f}."),
            DecisionFactor(name="Confidence", score=confidence_score, status=confidence_label, explanation=f"Model confidence is {confidence_label}."),
            DecisionFactor(name="Expected R", score=min(expected_r, 3.0) / 3.0 * 100, status="Favorable" if expected_r >= 1.5 else "Marginal" if expected_r >= 1.0 else "Poor", explanation=f"Expected reward is approximately {expected_r:.2f}R."),
        ]

        bullish_case, bearish_case, action_plan = [], [], []
        if score >= 80:
            bullish_case.append("Opportunity score is above the institutional execution threshold.")
        else:
            bearish_case.append("Opportunity score has not reached the strongest execution tier.")

        if expected_r >= 1.5:
            bullish_case.append("Reward-to-risk profile is acceptable for a planned trade.")
        else:
            bearish_case.append("Reward-to-risk profile needs improvement before full-size execution.")

        if recommendation == "Execution Ready":
            action_plan = ["Confirm price is still near the planned entry zone.", "Use the institutional order ticket to submit a paper order.", "Monitor lifecycle transition after fill."]
        elif recommendation == "Watch Closely":
            action_plan = ["Wait for stronger confirmation before execution.", "Reduce size if testing the setup in paper mode.", "Reassess if score or expected R improves."]
        else:
            action_plan = ["Do not enter this setup now.", "Keep it on the watchlist only if market structure improves."]

        summary = f"{symbol} on {timeframe} is classified as {recommendation}. Decision score is {decision_score:.1f}; confidence is {confidence_label}; expected reward is {expected_r:.2f}R."

        return AIDecisionNarrative(
            symbol=symbol, timeframe=timeframe, recommendation=recommendation,
            confidence_score=round(confidence_score, 2), confidence_label=confidence_label,
            decision=decision, summary=summary, bullish_case=bullish_case,
            bearish_case=bearish_case, action_plan=action_plan,
            risk_notes=["Do not exceed configured risk per trade.", "Confirm stop-loss level before execution.", "Avoid adding exposure if portfolio heat is elevated."],
            factors=factors,
        ).model_dump()

ai_decision_engine = AIDecisionEngine()
