from __future__ import annotations

from fastapi import APIRouter, HTTPException, Query

from app.adapters.market_data.demo_provider import DemoMarketDataProvider
from app.engines.institutional_intelligence.confluence_engine import confluence_engine
from app.engines.institutional_intelligence.opportunity_intelligence_engine import (
    opportunity_intelligence_engine,
)
from app.engines.market_intelligence.confidence_engine import confidence_engine
from app.engines.market_intelligence.decision_engine import decision_engine
from app.engines.market_intelligence.scoring_engine import strategy_scoring_engine
from app.engines.market_intelligence.technical_engine import technical_engine
from app.engines.market_intelligence.trade_planning_engine import trade_planning_engine

router = APIRouter(prefix="/api/technical", tags=["technical"])


@router.get("/{symbol}")
def analyze_symbol(
    symbol: str,
    timeframe: str = "15m",
    account_size: float = Query(default=10000.0, ge=100.0),
    risk_percent: float = Query(default=1.0, ge=0.1, le=10.0),
) -> dict:
    provider = DemoMarketDataProvider()

    try:
        series = provider.get_series(symbol=symbol.upper(), timeframe=timeframe)
        levels = technical_engine.analyze(series)
        score = strategy_scoring_engine.score(levels)
        plan = trade_planning_engine.plan(
            symbol=symbol.upper(),
            timeframe=timeframe,
            technical=levels,
            strategy_score=score,
            account_size=account_size,
            risk_percent=risk_percent,
        )
        confidence = confidence_engine.evaluate(
            technical=levels,
            strategy_score=score,
            trade_plan=plan,
        )

        confluence_levels = {}
        for tf in ["5m", "15m", "1h", "4h", "1d"]:
            tf_series = provider.get_series(symbol=symbol.upper(), timeframe=tf)
            confluence_levels[tf] = technical_engine.analyze(tf_series)

        confluence = confluence_engine.evaluate(
            symbol=symbol.upper(),
            primary_timeframe=timeframe,
            timeframe_levels=confluence_levels,
            base_confidence=confidence,
        )

        decision = decision_engine.decide(
            technical=levels,
            strategy_score=score,
            trade_plan=plan,
            confidence=confidence,
        )
        intelligence = opportunity_intelligence_engine.analyze(
            symbol=symbol.upper(),
            timeframe=timeframe,
            technical=levels,
            strategy_score=score,
            trade_plan=plan,
            confidence=confidence,
            decision=decision,
        )
    except Exception as error:
        raise HTTPException(status_code=400, detail=str(error)) from error

    return {
        "symbol": symbol.upper(),
        "timeframe": timeframe,
        "technical": levels.model_dump(),
        "strategy_score": score.model_dump(),
        "trade_plan": plan.model_dump(),
        "confidence": confidence.model_dump(),
        "confluence": confluence.model_dump(),
        "decision": decision.model_dump(),
        "opportunity_intelligence": intelligence.model_dump(),
    }
