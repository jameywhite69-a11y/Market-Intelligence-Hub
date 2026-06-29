from __future__ import annotations

from pydantic import BaseModel


class PortfolioRiskSnapshot(BaseModel):
    total_equity: float
    cash: float
    buying_power: float
    gross_exposure: float
    net_exposure: float
    exposure_percent: float
    open_risk: float
    open_positions: int
    realized_pnl: float
    unrealized_pnl: float
    portfolio_heat: float
    risk_status: str


class PortfolioRiskEngine:
    def calculate(self, execution_snapshot: dict, managed_positions: list[dict]) -> dict:
        equity = float(execution_snapshot.get("equity", 0.0))
        cash = float(execution_snapshot.get("cash", 0.0))
        buying_power = float(execution_snapshot.get("buying_power", cash))
        positions = execution_snapshot.get("open_positions", [])

        gross_exposure = 0.0
        for position in positions:
            qty = float(position.get("quantity", 0.0))
            mark = float(position.get("market_price", position.get("average_price", 0.0)))
            gross_exposure += abs(qty * mark)

        open_risk = 0.0
        for position in managed_positions:
            qty = 0.0
            for raw_position in positions:
                if raw_position.get("symbol") == position.get("symbol"):
                    qty = float(raw_position.get("quantity", 0.0))
            entry = float(position.get("entry_price") or 0.0)
            stop = float(position.get("stop_loss") or entry)
            open_risk += abs(entry - stop) * qty

        exposure_percent = 0.0 if equity <= 0 else (gross_exposure / equity) * 100
        portfolio_heat = 0.0 if equity <= 0 else (open_risk / equity) * 100

        if portfolio_heat >= 6:
            risk_status = "High"
        elif portfolio_heat >= 3:
            risk_status = "Moderate"
        else:
            risk_status = "Controlled"

        return PortfolioRiskSnapshot(
            total_equity=round(equity, 2),
            cash=round(cash, 2),
            buying_power=round(buying_power, 2),
            gross_exposure=round(gross_exposure, 2),
            net_exposure=round(gross_exposure, 2),
            exposure_percent=round(exposure_percent, 2),
            open_risk=round(open_risk, 2),
            open_positions=len(positions),
            realized_pnl=round(float(execution_snapshot.get("realized_pnl", 0.0)), 2),
            unrealized_pnl=round(float(execution_snapshot.get("unrealized_pnl", 0.0)), 2),
            portfolio_heat=round(portfolio_heat, 2),
            risk_status=risk_status,
        ).model_dump()


portfolio_risk_engine = PortfolioRiskEngine()
