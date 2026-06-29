from __future__ import annotations

from enum import Enum
from typing import Literal
from uuid import uuid4

from fastapi import APIRouter
from pydantic import BaseModel, Field, field_validator


router = APIRouter(prefix="/api/execution", tags=["execution"])


class OrderSide(str, Enum):
    buy = "buy"
    sell = "sell"


class OrderType(str, Enum):
    market = "market"
    limit = "limit"
    stop = "stop"
    stop_limit = "stop_limit"


class ExecutionOrderRequest(BaseModel):
    symbol: str = Field(..., min_length=1)
    timeframe: str = "15m"
    side: OrderSide
    quantity: float = Field(..., gt=0)
    order_type: OrderType = OrderType.market
    entry_price: float | None = None
    stop_loss: float | None = None
    take_profit: float | None = None
    confidence: str | None = None
    expected_r: float | None = None
    allocation: float | None = None
    source: str = "paper"

    @field_validator("symbol")
    @classmethod
    def normalize_symbol(cls, value: str) -> str:
        return value.strip().upper()


class ExecutionOrderResponse(BaseModel):
    accepted: bool
    order_id: str
    symbol: str
    side: str
    quantity: float
    order_type: str
    status: Literal["filled", "rejected"]
    fill_price: float
    requested_price: float | None = None
    reason: str | None = None


class ExecutionSnapshot(BaseModel):
    equity: float
    cash: float
    buying_power: float
    realized_pnl: float
    unrealized_pnl: float
    open_pnl: float
    trade_count: int
    win_rate: float
    open_positions: list[dict]
    orders: list[dict]


class PaperExecutionState:
    def __init__(self) -> None:
        self.reset()

    def reset(self) -> None:
        self.equity = 100000.0
        self.cash = 100000.0
        self.realized_pnl = 0.0
        self.orders: list[dict] = []
        self.positions: dict[str, dict] = {}

    def submit_order(self, order: ExecutionOrderRequest) -> ExecutionOrderResponse:
        fill_price = float(order.entry_price or 199.0)
        notional = order.quantity * fill_price

        if order.side == OrderSide.buy:
            if notional > self.cash:
                response = ExecutionOrderResponse(
                    accepted=False,
                    order_id=str(uuid4()),
                    symbol=order.symbol,
                    side=order.side.value,
                    quantity=order.quantity,
                    order_type=order.order_type.value,
                    status="rejected",
                    fill_price=fill_price,
                    requested_price=order.entry_price,
                    reason="Insufficient paper cash.",
                )
                self.orders.append(response.model_dump())
                return response

            self.cash -= notional
            position = self.positions.get(order.symbol)

            if position:
                existing_qty = float(position["quantity"])
                existing_avg = float(position["average_price"])
                total_qty = existing_qty + order.quantity
                position["average_price"] = ((existing_qty * existing_avg) + notional) / total_qty
                position["quantity"] = total_qty
                position["market_price"] = fill_price
            else:
                self.positions[order.symbol] = {
                    "symbol": order.symbol,
                    "side": "long",
                    "quantity": order.quantity,
                    "average_price": fill_price,
                    "market_price": fill_price,
                    "unrealized_pnl": 0.0,
                    "timeframe": order.timeframe,
                }

        else:
            position = self.positions.get(order.symbol)
            sell_qty = order.quantity

            if not position:
                response = ExecutionOrderResponse(
                    accepted=False,
                    order_id=str(uuid4()),
                    symbol=order.symbol,
                    side=order.side.value,
                    quantity=order.quantity,
                    order_type=order.order_type.value,
                    status="rejected",
                    fill_price=fill_price,
                    requested_price=order.entry_price,
                    reason="No open paper position to sell.",
                )
                self.orders.append(response.model_dump())
                return response

            existing_qty = float(position["quantity"])
            close_qty = min(existing_qty, sell_qty)
            avg_price = float(position["average_price"])
            realized = (fill_price - avg_price) * close_qty
            self.realized_pnl += realized
            self.cash += close_qty * fill_price

            remaining = existing_qty - close_qty
            if remaining <= 0:
                self.positions.pop(order.symbol, None)
            else:
                position["quantity"] = remaining
                position["market_price"] = fill_price
                position["unrealized_pnl"] = (fill_price - avg_price) * remaining

        response = ExecutionOrderResponse(
            accepted=True,
            order_id=str(uuid4()),
            symbol=order.symbol,
            side=order.side.value,
            quantity=order.quantity,
            order_type=order.order_type.value,
            status="filled",
            fill_price=fill_price,
            requested_price=order.entry_price,
        )
        self.orders.append(response.model_dump())
        return response

    def snapshot(self) -> ExecutionSnapshot:
        positions = list(self.positions.values())
        unrealized = sum(float(position.get("unrealized_pnl", 0.0)) for position in positions)
        equity = self.cash + sum(
            float(position.get("quantity", 0.0)) * float(position.get("market_price", 0.0))
            for position in positions
        )

        filled = [order for order in self.orders if order.get("status") == "filled"]
        wins = [order for order in filled if order.get("side") == "sell"]
        win_rate = 0.0 if not wins else 100.0

        return ExecutionSnapshot(
            equity=round(equity, 2),
            cash=round(self.cash, 2),
            buying_power=round(self.cash, 2),
            realized_pnl=round(self.realized_pnl, 2),
            unrealized_pnl=round(unrealized, 2),
            open_pnl=round(unrealized, 2),
            trade_count=len(filled),
            win_rate=win_rate,
            open_positions=positions,
            orders=self.orders,
        )


paper_state = PaperExecutionState()


@router.get("/snapshot")
def execution_snapshot() -> dict:
    return paper_state.snapshot().model_dump()


@router.post("/reset")
def reset_execution() -> dict:
    paper_state.reset()
    return paper_state.snapshot().model_dump()


@router.post("/orders")
def submit_execution_order(order: ExecutionOrderRequest) -> dict:
    response = paper_state.submit_order(order)
    return response.model_dump()
