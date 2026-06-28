from __future__ import annotations

from pydantic import BaseModel, Field


class ScanRequest(BaseModel):
    symbols: list[str] = Field(default_factory=list)
    timeframes: list[str] = Field(default_factory=lambda: ["15m"])
    indicators: list[str] = Field(default_factory=list)
    parameters: dict[str, dict] = Field(default_factory=dict)

    def normalized_symbols(self) -> list[str]:
        return [symbol.strip().upper() for symbol in self.symbols]

    def normalized_indicators(self) -> list[str]:
        return [indicator.strip().upper() for indicator in self.indicators]