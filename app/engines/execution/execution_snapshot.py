from __future__ import annotations

from pydantic import BaseModel

from app.engines.execution.order import SimulatedOrder
from app.engines.execution.position import Position


class ExecutionSnapshot(BaseModel):
    cash: float
    equity: float
    buying_power: float
    realized_pnl: float
    unrealized_pnl: float
    open_positions: list[Position]
    orders: list[SimulatedOrder]
    win_rate: float
    trade_count: int
