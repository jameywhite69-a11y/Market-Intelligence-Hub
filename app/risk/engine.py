from __future__ import annotations

from app.execution.service import execution_service
from app.risk.models import RiskAssessment, RiskCheck, RiskDecision


class InstitutionalRiskEngine:
    def assess(self, context: dict) -> dict:
        opportunity = context.get("selectedOpportunity") or context.get("opportunity") or context
        execution = execution_service.snapshot().model_dump()

        symbol = str(opportunity.get("symbol", context.get("symbol", "UNKNOWN"))).upper()
        timeframe = str(opportunity.get("timeframe", context.get("timeframe", "15m")))

        equity = float(execution.get("equity", 100000.0))
        buying_power = float(execution.get("buying_power", execution.get("cash", equity)))
        positions = execution.get("positions", []) or execution.get("open_positions", []) or []

        price = float(opportunity.get("entry_price") or opportunity.get("price") or opportunity.get("current_price") or 199.0)
        stop = float(opportunity.get("stop_loss") or price * 0.97)
        expected_r = float(opportunity.get("expectedR") or opportunity.get("expected_r") or 0.0)

        risk_per_unit = max(0.0001, abs(price - stop))
        daily_risk_budget = equity * 0.015
        max_trade_risk = equity * 0.01

        open_risk = self._open_risk(positions)
        daily_risk_used = min(daily_risk_budget, open_risk)
        daily_risk_remaining = max(0.0, daily_risk_budget - daily_risk_used)

        proposed_risk = min(max_trade_risk, daily_risk_remaining)
        recommended_quantity = 0.0 if proposed_risk <= 0 else proposed_risk / risk_per_unit
        recommended_notional = recommended_quantity * price

        heat_before = (open_risk / equity * 100.0) if equity else 0.0
        heat_after = ((open_risk + proposed_risk) / equity * 100.0) if equity else 0.0

        checks: list[RiskCheck] = []
        warnings: list[str] = []
        rejections: list[str] = []

        self._check(checks, warnings, rejections, "Daily Risk Remaining", daily_risk_remaining, 0, daily_risk_remaining > 0, "No daily risk budget remains.")
        self._check(checks, warnings, rejections, "Portfolio Heat After", heat_after, 6.0, heat_after <= 6.0, "Portfolio heat would exceed the 6% maximum.")
        self._check(checks, warnings, rejections, "Buying Power", buying_power, recommended_notional, buying_power >= recommended_notional, "Buying power is insufficient.")
        self._check(checks, warnings, rejections, "Open Positions", len(positions), 8, len(positions) < 8, "Maximum open-position count would be exceeded.")
        self._check(checks, warnings, rejections, "Expected R", expected_r, 1.0, expected_r >= 1.0, "Expected reward is below 1.0R.")

        if heat_after >= 4.0 and heat_after <= 6.0:
            warnings.append("Portfolio heat is elevated; use reduced size or wait for confirmation.")

        if rejections:
            decision = RiskDecision.rejected
            recommended_quantity = 0.0
            recommended_notional = 0.0
            proposed_risk = 0.0
        elif warnings:
            decision = RiskDecision.caution
        else:
            decision = RiskDecision.approved

        return RiskAssessment(
            symbol=symbol,
            timeframe=timeframe,
            decision=decision,
            portfolio_heat_before=round(heat_before, 2),
            portfolio_heat_after=round(heat_after, 2),
            daily_risk_budget=round(daily_risk_budget, 2),
            daily_risk_used=round(daily_risk_used, 2),
            daily_risk_remaining=round(daily_risk_remaining, 2),
            proposed_risk=round(proposed_risk, 2),
            recommended_quantity=round(recommended_quantity, 4),
            recommended_notional=round(recommended_notional, 2),
            expected_r=round(expected_r, 2),
            checks=checks,
            warnings=warnings,
            rejection_reasons=rejections,
        ).model_dump()

    def _open_risk(self, positions: list[dict]) -> float:
        risk = 0.0
        for position in positions:
            qty = abs(float(position.get("quantity", 0.0)))
            avg = float(position.get("average_price", position.get("avg_price", 0.0)) or 0.0)
            mark = float(position.get("market_price", position.get("mark_price", avg)) or avg)
            stop = float(position.get("stop_loss", 0.0) or 0.0)
            if stop > 0:
                risk += abs(mark - stop) * qty
            else:
                risk += abs(qty * mark) * 0.03
        return risk

    def _check(self, checks, warnings, rejections, name, value, limit, passed, fail_message):
        if passed:
            status = "Pass"
            message = "Within institutional limits."
        else:
            status = "Fail"
            message = fail_message
            rejections.append(fail_message)

        checks.append(RiskCheck(name=name, status=status, value=round(value, 2) if isinstance(value, float) else value, limit=limit, message=message))


institutional_risk_engine = InstitutionalRiskEngine()
