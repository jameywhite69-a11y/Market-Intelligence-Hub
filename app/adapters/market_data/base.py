from abc import ABC, abstractmethod


class MarketDataAdapter(ABC):
    @abstractmethod
    def quote(self, symbol: str) -> dict:
        raise NotImplementedError

    @abstractmethod
    def historical(self, symbol: str, timeframe: str, bars: int = 120) -> dict:
        raise NotImplementedError
