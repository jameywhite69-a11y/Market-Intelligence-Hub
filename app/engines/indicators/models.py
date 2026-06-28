from __future__ import annotations

from typing import Any, Literal

from pydantic import BaseModel, Field


IndicatorCategory = Literal[
    "trend",
    "momentum",
    "volatility",
    "volume",
    "market_structure",
    "custom",
]

ParameterType = Literal["int", "float", "str", "bool"]


class IndicatorParameter(BaseModel):
    name: str
    parameter_type: ParameterType
    default: Any
    minimum: float | None = None
    maximum: float | None = None
    description: str = ""


class IndicatorDefinition(BaseModel):
    name: str
    key: str
    category: IndicatorCategory
    description: str = ""
    parameters: list[IndicatorParameter] = Field(default_factory=list)
    outputs: list[str] = Field(default_factory=lambda: ["series"])
    version: str = "1.0.0"
    enabled: bool = True

    def normalized_key(self) -> str:
        return self.key.strip().upper()


class IndicatorResult(BaseModel):
    indicator: str
    symbol: str = ""
    timeframe: str = ""

    values: dict[str, Any] = Field(default_factory=dict)
    signals: dict[str, Any] = Field(default_factory=dict)
    metadata: dict[str, Any] = Field(default_factory=dict)

    warnings: list[str] = Field(default_factory=list)

    def normalized_indicator(self) -> str:
        return self.indicator.strip().upper()