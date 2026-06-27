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