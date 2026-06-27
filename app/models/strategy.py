from pydantic import BaseModel, Field


class StrategyDefinition(BaseModel):
    name: str = Field(default="EMA RVOL Pullback")
    direction: str = Field(default="Long Only")
    timeframe: str = Field(default="15m")
    trend_filter: str = Field(default="EMA29 > EMA54")
    momentum_filter: str = Field(default="ADX > 16")
    volume_filter: str = Field(default="RVOL > 1.5")
    entry_rule: str = Field(default="Pullback reclaim")
    exit_rule: str = Field(default="Close below EMA54")
    risk_rule: str = Field(default="1% account risk")
    generate_pine: bool = True
    generate_easylanguage: bool = True
    generate_python: bool = True
