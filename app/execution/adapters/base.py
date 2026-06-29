from __future__ import annotations

from abc import ABC, abstractmethod

from app.execution.models import ExecutionOrderRequest, ExecutionOrderResponse, ExecutionSnapshot


class BrokerAdapter(ABC):
    name: str
    mode: str

    @abstractmethod
    def submit_order(self, order: ExecutionOrderRequest) -> ExecutionOrderResponse:
        raise NotImplementedError

    @abstractmethod
    def snapshot(self) -> ExecutionSnapshot:
        raise NotImplementedError

    @abstractmethod
    def reset(self) -> ExecutionSnapshot:
        raise NotImplementedError
