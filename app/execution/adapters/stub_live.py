from __future__ import annotations

from app.execution.adapters.base import BrokerAdapter
from app.execution.models import ExecutionOrderRequest, ExecutionOrderResponse, ExecutionSnapshot


class StubLiveBrokerAdapter(BrokerAdapter):
    name = "stub_live"
    mode = "disabled"

    def submit_order(self, order: ExecutionOrderRequest) -> ExecutionOrderResponse:
        return ExecutionOrderResponse(
            accepted=False,
            order_id="live-disabled",
            broker=self.name,
            symbol=order.symbol,
            side=order.side.value,
            quantity=order.quantity,
            order_type=order.order_type.value,
            status="rejected",
            fill_price=None,
            requested_price=order.entry_price,
            reason="Live broker adapter is not enabled yet.",
        )

    def snapshot(self) -> ExecutionSnapshot:
        return ExecutionSnapshot(
            broker=self.name,
            mode=self.mode,
            equity=0.0,
            cash=0.0,
            buying_power=0.0,
            realized_pnl=0.0,
            unrealized_pnl=0.0,
            open_pnl=0.0,
            trade_count=0,
            win_rate=0.0,
            open_positions=[],
            orders=[],
        )

    def reset(self) -> ExecutionSnapshot:
        return self.snapshot()
