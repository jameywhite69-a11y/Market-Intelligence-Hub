class AIEngine:
    def explain_trade(self, analysis: dict) -> str:
        if analysis.get("passed"):
            return "Rules are aligned. Confirm liquidity, spread, and risk before execution."
        return "Setup is not complete. Wait for stronger rule confirmation."

    def review_strategy(self, strategy: dict) -> dict:
        return {
            "summary": "Strategy structure is valid for prototype analysis.",
            "suggestions": [
                "Add explicit stop logic.",
                "Add market regime filter.",
                "Test across multiple timeframes.",
            ],
        }


ai_engine = AIEngine()
