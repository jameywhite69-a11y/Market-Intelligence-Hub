from abc import ABC, abstractmethod


class BrokerAdapter(ABC):
    @abstractmethod
    def place_order(self, order: dict) -> dict:
        raise NotImplementedError

    @abstractmethod
    def flatten_symbol(self, symbol: str) -> dict:
        raise NotImplementedError
