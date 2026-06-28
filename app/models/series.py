from __future__ import annotations

from pydantic import BaseModel, Field


class PriceSeries(BaseModel):
    symbol: str = ""
    timeframe: str = ""

    open: list[float] = Field(default_factory=list)
    high: list[float] = Field(default_factory=list)
    low: list[float] = Field(default_factory=list)
    close: list[float] = Field(default_factory=list)
    volume: list[float] = Field(default_factory=list)

    def length(self) -> int:
        return len(self.close)

    def is_empty(self) -> bool:
        return self.length() == 0

    def latest_close(self) -> float | None:
        if not self.close:
            return None
        return self.close[-1]

    def validate_lengths(self) -> bool:
        lengths = {
            len(self.open),
            len(self.high),
            len(self.low),
            len(self.close),
            len(self.volume),
        }
        return len(lengths) == 1