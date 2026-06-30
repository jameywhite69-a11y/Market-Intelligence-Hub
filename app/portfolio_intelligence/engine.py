from __future__ import annotations

from app.execution.service import execution_service
from app.portfolio_intelligence.models import ExposureBucket, PortfolioIntelligenceSnapshot


class PortfolioIntelligenceEngine:
    def snapshot(self) -> dict:
        execution = execution_service.snapshot().model_dump()

        equity = float(execution.get("equity", 100000.0))
        cash = float(execution.get("cash", equity))
        buying_power = float(execution.get("buying_power", cash))
        open_pnl = float(execution.get("open_pnl", 0.0))
        realized_pnl = float(execution.get("realized_pnl", 0.0))
        positions = execution.get("positions", []) or []

        open_positions = len(positions)

        total_notional = 0.0
        crypto_notional = 0.0
        equity_notional = 0.0
        other_notional = 0.0
        open_risk = 0.0

        crypto_symbols = {"BTC", "ETH", "SOL", "LINK", "AVAX", "ATOM", "BCH", "DOGE", "XRP", "ADA", "BNB"}

        for position in positions:
            symbol = str(position.get("symbol", "")).upper()
            quantity = float(position.get("quantity", 0.0))
            avg_price = float(position.get("avg_price", position.get("average_price", 0.0)) or 0.0)
            mark_price = float(position.get("mark_price", position.get("current_price", avg_price)) or avg_price)
            stop_loss = float(position.get("stop_loss", 0.0) or 0.0)

            notional = abs(quantity * mark_price)
            total_notional += notional

            if stop_loss > 0:
                open_risk += abs(mark_price - stop_loss) * abs(quantity)
            else:
                open_risk += notional * 0.03

            if symbol in crypto_symbols:
                crypto_notional += notional
            elif symbol:
                equity_notional += notional
            else:
                other_notional += notional

        daily_risk_budget = equity * 0.015
        daily_risk_used = min(daily_risk_budget, open_risk)
        daily_risk_remaining = max(0.0, daily_risk_budget - daily_risk_used)
        heat = (open_risk / equity * 100) if equity else 0.0

        exposure = [
            ExposureBucket(name="Crypto", notional=round(crypto_notional, 2), percent=round((crypto_notional / equity * 100) if equity else 0.0, 2)),
            ExposureBucket(name="Equities", notional=round(equity_notional, 2), percent=round((equity_notional / equity * 100) if equity else 0.0, 2)),
            ExposureBucket(name="Other", notional=round(other_notional, 2), percent=round((other_notional / equity * 100) if equity else 0.0, 2)),
            ExposureBucket(name="Cash", notional=round(cash, 2), percent=round((cash / equity * 100) if equity else 0.0, 2)),
        ]

        warnings = []
        if heat > 5:
            warnings.append("Portfolio heat is elevated. Reduce new risk or tighten stops.")
        if open_positions >= 6:
            warnings.append("Many open positions detected. Avoid over-diversifying correlated trades.")
        if buying_power < equity * 0.2:
            warnings.append("Buying power is getting low.")

        if warnings:
            recommendation = "Risk review required before adding exposure."
        elif open_positions == 0:
            recommendation = "Portfolio is flat. Wait for qualified opportunities."
        else:
            recommendation = "Portfolio risk is acceptable. Continue managing open positions."

        return PortfolioIntelligenceSnapshot(
            equity=round(equity, 2),
            cash=round(cash, 2),
            buying_power=round(buying_power, 2),
            open_pnl=round(open_pnl, 2),
            realized_pnl=round(realized_pnl, 2),
            open_positions=open_positions,
            open_risk=round(open_risk, 2),
            portfolio_heat_percent=round(heat, 2),
            daily_risk_budget=round(daily_risk_budget, 2),
            daily_risk_used=round(daily_risk_used, 2),
            daily_risk_remaining=round(daily_risk_remaining, 2),
            exposure=exposure,
            warnings=warnings,
            recommendation=recommendation,
        ).model_dump()


portfolio_intelligence_engine = PortfolioIntelligenceEngine()
