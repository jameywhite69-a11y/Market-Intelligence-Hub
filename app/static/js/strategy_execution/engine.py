from __future__ import annotations
from uuid import uuid4
from app.execution.service import execution_service
from app.strategy_execution.models import ExecutionPlan, PlanStatus, SignalAction, StrategySignal
from app.strategy_execution.registry import strategy_registry

class StrategyExecutionEngine:
    def generate_signal(self, opportunity: dict) -> StrategySignal:
        score = float(opportunity.get("score", 0.0))
        symbol = str(opportunity.get("symbol", "")).upper()
        timeframe = str(opportunity.get("timeframe", "15m"))
        strategy = strategy_registry.best_for_score(score)
        confidence = min(100.0, max(0.0, score))
        action = SignalAction.buy if score >= strategy.min_score else SignalAction.hold
        price = float(opportunity.get("price") or opportunity.get("current_price") or opportunity.get("entry_price") or 199.0)

        rationale = [
            f"Scanner score is {score:.1f}.",
            f"Selected strategy: {strategy.name}.",
            "Score is above strategy threshold." if action == SignalAction.buy else "Score is below execution threshold; watch only.",
        ]

        return StrategySignal(
            strategy_id=strategy.strategy_id,
            symbol=symbol,
            timeframe=timeframe,
            action=action,
            confidence=confidence,
            score=score,
            rationale=rationale,
            entry_price=price,
            stop_loss=round(price * 0.97, 4),
            target_1=round(price * 1.02, 4),
            target_2=round(price * 1.04, 4),
        )

    def build_plan(self, signal: StrategySignal) -> ExecutionPlan:
        strategy = strategy_registry.get(signal.strategy_id)
        snapshot = execution_service.snapshot().model_dump()
        account_equity = float(snapshot.get("equity", 100000.0))
        buying_power = float(snapshot.get("buying_power", account_equity))
        entry = float(signal.entry_price or 199.0)
        stop = float(signal.stop_loss or entry * 0.97)
        target_1 = float(signal.target_1 or entry * 1.02)
        target_2 = float(signal.target_2 or entry * 1.04)
        risk_per_share = max(0.0001, abs(entry - stop))
        dollar_risk = account_equity * (strategy.risk_percent / 100)
        quantity = dollar_risk / risk_per_share
        notional = quantity * entry
        reward = abs(target_2 - entry) * quantity
        expected_r = 0.0 if dollar_risk <= 0 else reward / dollar_risk

        rejection_reasons = []
        if signal.action != SignalAction.buy:
            rejection_reasons.append("Signal is not a buy signal.")
        if signal.confidence < strategy.min_confidence:
            rejection_reasons.append("Confidence is below strategy threshold.")
        if notional > buying_power:
            rejection_reasons.append("Insufficient buying power.")
        if expected_r < 1.0:
            rejection_reasons.append("Expected R is below 1.0.")

        status = PlanStatus.rejected if rejection_reasons else PlanStatus.approved

        return ExecutionPlan(
            plan_id=str(uuid4()),
            strategy_id=signal.strategy_id,
            symbol=signal.symbol,
            timeframe=signal.timeframe,
            action=signal.action,
            status=status,
            quantity=round(quantity, 4),
            entry_price=round(entry, 4),
            stop_loss=round(stop, 4),
            target_1=round(target_1, 4),
            target_2=round(target_2, 4),
            dollar_risk=round(dollar_risk, 2),
            expected_r=round(expected_r, 2),
            notional=round(notional, 2),
            rationale=signal.rationale,
            rejection_reasons=rejection_reasons,
        )

    def plan_from_opportunity(self, opportunity: dict) -> dict:
        signal = self.generate_signal(opportunity)
        plan = self.build_plan(signal)
        return {"signal": signal.model_dump(), "plan": plan.model_dump()}

    def execute_plan(self, plan: ExecutionPlan) -> dict:
        if plan.status != PlanStatus.approved:
            return {"accepted": False, "reason": "Execution plan is not approved.", "plan": plan.model_dump()}

        from app.execution.models import ExecutionOrderRequest

        order = ExecutionOrderRequest(
            symbol=plan.symbol,
            timeframe=plan.timeframe,
            side=plan.action.value,
            quantity=plan.quantity,
            order_type="market",
            entry_price=plan.entry_price,
            stop_loss=plan.stop_loss,
            take_profit=plan.target_2,
            expected_r=plan.expected_r,
            source=f"strategy:{plan.strategy_id}",
        )
        response = execution_service.submit_order(order)
        return {"accepted": response.accepted, "order": response.model_dump(), "plan": plan.model_dump()}

strategy_execution_engine = StrategyExecutionEngine()
