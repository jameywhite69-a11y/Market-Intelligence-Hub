from __future__ import annotations

from app.execution.adapters.backtest import BacktestBrokerAdapter
from app.execution.adapters.base import BrokerAdapter
from app.execution.adapters.paper import PaperBrokerAdapter
from app.execution.adapters.stub_live import StubLiveBrokerAdapter
from app.execution.models import ExecutionOrderRequest, ExecutionOrderResponse, ExecutionSnapshot


class ExecutionService:
    def __init__(self) -> None:
        self.adapters: dict[str, BrokerAdapter] = {
            "paper": PaperBrokerAdapter(),
            "backtest": BacktestBrokerAdapter(),
            "stub_live": StubLiveBrokerAdapter(),
        }
        self.active_adapter_name = "paper"

    def adapter_names(self) -> list[str]:
        return list(self.adapters.keys())

    def active_adapter(self) -> BrokerAdapter:
        return self.adapters[self.active_adapter_name]

    def set_active_adapter(self, name: str) -> ExecutionSnapshot:
        if name not in self.adapters:
            raise ValueError(f"Unknown execution adapter: {name}")
        self.active_adapter_name = name
        return self.snapshot()

    def submit_order(self, order: ExecutionOrderRequest) -> ExecutionOrderResponse:
        return self.active_adapter().submit_order(order)

    def snapshot(self) -> ExecutionSnapshot:
        return self.active_adapter().snapshot()

    def reset(self) -> ExecutionSnapshot:
        return self.active_adapter().reset()


execution_service = ExecutionService()
