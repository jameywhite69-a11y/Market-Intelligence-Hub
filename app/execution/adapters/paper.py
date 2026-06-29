from __future__ import annotations

from uuid import uuid4

from app.execution.adapters.base import BrokerAdapter
from app.execution.models import ExecutionOrderRequest, ExecutionOrderResponse, ExecutionSnapshot, OrderSide


class PaperBrokerAdapter(BrokerAdapter):
    name = "paper"
    mode = "simulated"

    def __init__(self) -> None:
        self.reset()

    def reset(self) -> ExecutionSnapshot:
        self.equity = 100000.0
        self.cash = 100000.0
        self.realized_pnl = 0.0
        self.orders: list[dict] = []
        self.positions: dict[str, dict] = {}
        return self.snapshot()

    def submit_order(self, order: ExecutionOrderRequest) -> ExecutionOrderResponse:
        fill_price = float(order.entry_price or 199.0)
        notional = order.quantity * fill_price

        if order.side == OrderSide.buy:
            response = self._buy(order, fill_price, notional)
        else:
            response = self._sell(order, fill_price)

        self.orders.append(response.model_dump())
        return response

    def _buy(self, order: ExecutionOrderRequest, fill_price: float, notional: float) -> ExecutionOrderResponse:
        if notional > self.cash:
            return self._reject(order, fill_price, "Insufficient paper cash.")

        self.cash -= notional
        position = self.positions.get(order.symbol)

        if position:
            existing_qty = float(position["quantity"])
            existing_avg = float(position["average_price"])
            total_qty = existing_qty + order.quantity
            position["average_price"] = ((existing_qty * existing_avg) + notional) / total_qty
            position["quantity"] = total_qty
            position["market_price"] = fill_price
            position["unrealized_pnl"] = (fill_price - position["average_price"]) * total_qty
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

        return ExecutionOrderResponse(
            accepted=True,
            order_id=str(uuid4()),
            broker=self.name,
            symbol=order.symbol,
            side=order.side.value,
            quantity=order.quantity,
            order_type=order.order_type.value,
            status="filled",
            fill_price=fill_price,
            requested_price=order.entry_price,
        )

    def _sell(self, order: ExecutionOrderRequest, fill_price: float) -> ExecutionOrderResponse:
        position = self.positions.get(order.symbol)

        if not position:
            return self._reject(order, fill_price, "No open paper position to sell.")

        existing_qty = float(position["quantity"])
        close_qty = min(existing_qty, order.quantity)
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

        return ExecutionOrderResponse(
            accepted=True,
            order_id=str(uuid4()),
            broker=self.name,
            symbol=order.symbol,
            side=order.side.value,
            quantity=close_qty,
            order_type=order.order_type.value,
            status="filled",
            fill_price=fill_price,
            requested_price=order.entry_price,
        )

    def _reject(self, order: ExecutionOrderRequest, fill_price: float, reason: str) -> ExecutionOrderResponse:
        return ExecutionOrderResponse(
            accepted=False,
            order_id=str(uuid4()),
            broker=self.name,
            symbol=order.symbol,
            side=order.side.value,
            quantity=order.quantity,
            order_type=order.order_type.value,
            status="rejected",
            fill_price=fill_price,
            requested_price=order.entry_price,
            reason=reason,
        )

    def snapshot(self) -> ExecutionSnapshot:
        positions = list(self.positions.values())
        unrealized = sum(float(position.get("unrealized_pnl", 0.0)) for position in positions)
        equity = self.cash + sum(
            float(position.get("quantity", 0.0)) * float(position.get("market_price", 0.0))
            for position in positions
        )

        filled = [order for order in self.orders if order.get("status") == "filled"]
        closed_sells = [order for order in filled if order.get("side") == "sell"]
        win_rate = 0.0 if not closed_sells else 100.0

        return ExecutionSnapshot(
            broker=self.name,
            mode=self.mode,
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
