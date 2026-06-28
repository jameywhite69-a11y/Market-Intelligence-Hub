from __future__ import annotations

from typing import Any

from pydantic import BaseModel, Field


class ScanResult(BaseModel):
    symbol: str
    timeframe: str
    indicator_results: dict[str, dict[str, Any]] = Field(default_factory=dict)
    score: float = 0.0
    rank: int | None = None
    tags: list[str] = Field(default_factory=list)
    warnings: list[str] = Field(default_factory=list)

    def key(self) -> str:
        return f"{self.symbol.upper()}:{self.timeframe}"