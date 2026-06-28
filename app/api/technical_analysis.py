from __future__ import annotations

from fastapi import APIRouter, HTTPException

from app.adapters.market_data.demo_provider import DemoMarketDataProvider
from app.engines.market_intelligence.scoring_engine import strategy_scoring_engine
from app.engines.market_intelligence.technical_engine import technical_engine

router = APIRouter(prefix="/api/technical", tags=["technical"])


@router.get("/{symbol}")
def analyze_symbol(symbol: str, timeframe: str = "15m") -> dict:
    provider = DemoMarketDataProvider()

    try:
        series = provider.get_series(symbol=symbol.upper(), timeframe=timeframe)
        levels = technical_engine.analyze(series)
        score = strategy_scoring_engine.score(levels)
    except Exception as error:
        raise HTTPException(status_code=400, detail=str(error)) from error

    return {
        "symbol": symbol.upper(),
        "timeframe": timeframe,
        "technical": levels.model_dump(),
        "strategy_score": score.model_dump(),
    }
