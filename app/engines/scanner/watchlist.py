from __future__ import annotations

from pydantic import BaseModel, Field


class Watchlist(BaseModel):
    name: str
    symbols: list[str] = Field(default_factory=list)
    description: str = ""

    def normalized_symbols(self) -> list[str]:
        return sorted({symbol.strip().upper() for symbol in self.symbols if symbol.strip()})

    def add_symbol(self, symbol: str) -> None:
        normalized = symbol.strip().upper()
        if normalized and normalized not in self.symbols:
            self.symbols.append(normalized)

    def remove_symbol(self, symbol: str) -> None:
        normalized = symbol.strip().upper()
        self.symbols = [item for item in self.symbols if item.strip().upper() != normalized]