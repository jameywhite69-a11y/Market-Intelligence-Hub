from __future__ import annotations
from enum import Enum
from pydantic import BaseModel, Field

class StrategyLifecycle(str, Enum):
    draft = "Draft"
    research = "Research"
    backtest = "Backtest"
    paper_validation = "Paper Validation"
    live_candidate = "Live Candidate"
    production = "Production"
    archived = "Archived"

class StrategyRiskProfile(str, Enum):
    conservative = "Conservative"
    balanced = "Balanced"
    aggressive = "Aggressive"

class StrategyDefinition(BaseModel):
    strategy_id: str
    name: str
    version: str = "1.0"
    description: str = ""
    lifecycle: StrategyLifecycle = StrategyLifecycle.research
    risk_profile: StrategyRiskProfile = StrategyRiskProfile.balanced
    supported_assets: list[str] = Field(default_factory=list)
    supported_timeframes: list[str] = Field(default_factory=list)
    deployment_status: str = "Research Only"
    health_score: float = 0.0
    paper_trades: int = 0
    live_trades: int = 0
    win_rate: float = 0.0
    profit_factor: float = 0.0
    expectancy_r: float = 0.0
    max_drawdown_percent: float = 0.0
    notes: list[str] = Field(default_factory=list)
