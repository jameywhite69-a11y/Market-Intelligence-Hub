from typing import Any, Literal
from pydantic import BaseModel, Field

RuleType = Literal["EMA", "ADX", "RVOL", "RSI", "VWAP", "CANDLE", "PRICE"]
LogicType = Literal["AND", "OR"]

class StrategyRule(BaseModel):
    id: str
    rule_type: RuleType
    label: str
    enabled: bool = True
    operator: str = ">"
    left: str | None = None
    right: str | None = None
    value: float | str | None = None
    params: dict[str, Any] = Field(default_factory=dict)

class StrategyRuleGraph(BaseModel):
    name: str = "EMA RVOL Pullback Rule Graph"
    logic: LogicType = "AND"
    direction: str = "Long Only"
    timeframe: str = "15m"
    rules: list[StrategyRule] = Field(default_factory=list)
