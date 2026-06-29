from __future__ import annotations

from dataclasses import dataclass, field
from datetime import datetime, timezone
from uuid import uuid4

from app.engines.execution.execution_snapshot import ExecutionSnapshot
from app.engines.execution.order import OrderRequest, SimulatedOrder
from app.engines.execution.position import Position


@dataclass(slots=True)
class ExecutionEngine:
    starting_cash: float = 100000.0
    commission_per_order: float = 1.0
    slippage_percent: float = 0.02
    cash: float = 100000.0
    orders: list[SimulatedOrder] = field(default_factory=list)
    positions: dict[str, Position] = field(default_factory=dict)
    closed_trade_pnls: list[float] = field(default_factory=list)

    def submit_order(self, request: OrderRequest, market_price: float) -> SimulatedOrder:
        if request.quantity <= 0:
            return self._rejected(request, "Quantity must be greater than zero.")

        fill_price = self._fill_price(request, market_price)
        notional = fill_price * request.quantity
        commission = self.commission_per_order
        slippage = abs(fill_price - market_price) * request.quantity

        if request.side.lower() == "buy" and notional + commission > self.cash:
            return self._rejected(request, "Insufficient simulated buying power.")

        order = SimulatedOrder(
            order_id=str(uuid4()),
            symbol=request.symbol.upper(),
            side=request.side.lower(),
            quantity=request.quantity,
            order_type=request.order_type,
            status="filled",
            requested_price=request.limit_price or request.stop_price or market_price,
            fill_price=round(fill_price, 4),
            commission=commission,
            slippage=round(slippage, 4),
            source=request.source,
            timeframe=request.timeframe,
            updated_at=datetime.now(timezone.utc),
            note="Simulated fill.",
        )

        self.orders.append(order)
        self._apply_fill(order)
        self.mark_to_market(request.symbol.upper(), market_price)
        return order

    def cancel_order(self, order_id: str) -> SimulatedOrder | None:
        for order in self.orders:
            if order.order_id == order_id and order.status == "pending":
                order.status = "cancelled"
                order.updated_at = datetime.now(timezone.utc)
                return order
        return None

    def mark_to_market(self, symbol: str, market_price: float) -> None:
        position = self.positions.get(symbol.upper())
        if not position:
            return

        position.market_price = market_price
        if position.side == "long":
            position.unrealized_pnl = round((market_price - position.average_price) * position.quantity, 2)
        else:
            position.unrealized_pnl = round((position.average_price - market_price) * abs(position.quantity), 2)

    def snapshot(self) -> ExecutionSnapshot:
        positions = list(self.positions.values())
        unrealized = round(sum(position.unrealized_pnl for position in positions), 2)
        realized = round(sum(self.closed_trade_pnls), 2)
        equity = round(self.cash + sum(position.market_price * position.quantity for position in positions) + unrealized, 2)
        wins = sum(1 for pnl in self.closed_trade_pnls if pnl > 0)
        win_rate = round((wins / len(self.closed_trade_pnls)) * 100, 2) if self.closed_trade_pnls else 0.0

        return ExecutionSnapshot(
            cash=round(self.cash, 2),
            equity=equity,
            buying_power=round(self.cash, 2),
            realized_pnl=realized,
            unrealized_pnl=unrealized,
            open_positions=positions,
            orders=self.orders[-100:],
            win_rate=win_rate,
            trade_count=len(self.closed_trade_pnls),
        )

    def reset(self) -> ExecutionSnapshot:
        self.cash = self.starting_cash
        self.orders.clear()
        self.positions.clear()
        self.closed_trade_pnls.clear()
        return self.snapshot()

    def _fill_price(self, request: OrderRequest, market_price: float) -> float:
        side = request.side.lower()
        slip = market_price * (self.slippage_percent / 100.0)

        if request.order_type == "limit" and request.limit_price is not None:
            return request.limit_price

        if request.order_type == "stop" and request.stop_price is not None:
            return request.stop_price

        return market_price + slip if side == "buy" else market_price - slip

    def _apply_fill(self, order: SimulatedOrder) -> None:
        symbol = order.symbol
        fill = float(order.fill_price or 0)
        qty = float(order.quantity)

        if order.side == "buy":
            self.cash -= fill * qty + order.commission
            existing = self.positions.get(symbol)

            if not existing:
                self.positions[symbol] = Position(
                    symbol=symbol,
                    quantity=qty,
                    average_price=fill,
                    market_price=fill,
                    unrealized_pnl=0,
                    realized_pnl=0,
                    side="long",
                )
                return

            total_qty = existing.quantity + qty
            existing.average_price = round(((existing.average_price * existing.quantity) + (fill * qty)) / total_qty, 4)
            existing.quantity = total_qty
            existing.market_price = fill
            return

        if order.side == "sell":
            existing = self.positions.get(symbol)

            if not existing:
                order.status = "rejected"
                order.note = "No open long position to sell."
                return

            close_qty = min(qty, existing.quantity)
            pnl = (fill - existing.average_price) * close_qty - order.commission
            self.closed_trade_pnls.append(round(pnl, 2))
            self.cash += fill * close_qty - order.commission
            existing.quantity -= close_qty
            existing.realized_pnl += round(pnl, 2)

            if existing.quantity <= 0:
                del self.positions[symbol]
            else:
                existing.market_price = fill

    def _rejected(self, request: OrderRequest, note: str) -> SimulatedOrder:
        order = SimulatedOrder(
            order_id=str(uuid4()),
            symbol=request.symbol.upper(),
            side=request.side.lower(),
            quantity=request.quantity,
            order_type=request.order_type,
            status="rejected",
            requested_price=request.limit_price or request.stop_price,
            source=request.source,
            timeframe=request.timeframe,
            note=note,
        )
        self.orders.append(order)
        return order


execution_engine = ExecutionEngine()
