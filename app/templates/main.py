"""
Market Intelligence Hub — FastAPI Application
Organized main.py

Purpose:
- Mount static assets
- Register API routes
- Include API routers
- Serve workstation pages

Notes:
- Direct routes are kept for backward compatibility with existing frontend calls.
- Routers are grouped by subsystem for easier maintenance.
"""

from pathlib import Path

from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates

# ---------------------------------------------------------------------------
# API imports — decision / AI / risk
# ---------------------------------------------------------------------------

from app.api.ai_decision_api import analyze_decision, router as ai_decision_router
from app.api.institutional_risk_api import assess_risk, router as institutional_risk_router
from app.api.rule_engine import router as rule_engine_router

# ---------------------------------------------------------------------------
# API imports — market / scanner / technicals / watchlists
# ---------------------------------------------------------------------------

from app.api.backtest import router as backtest_router
from app.api.indicators import router as indicator_router
from app.api.live_market_data_api import get_quote, get_snapshot
from app.api.live_market_data_api import router as live_market_data_router
from app.api.market import router as market_router
from app.api.market_data import router as market_data_router
from app.api.scanner import router as legacy_scanner_router
from app.api.scanner_api import create_scan_job, get_scan_job, run_scan_job
from app.api.scanner_api import router as scanner_api_router
from app.api.state import router as state_router
from app.api.technical_analysis import analyze_symbol
from app.api.technical_analysis import router as technical_router
from app.api.watchlist_api import router as watchlist_router

# ---------------------------------------------------------------------------
# API imports — execution / strategy / lifecycle / positions
# ---------------------------------------------------------------------------

from app.api.execution_api import (
    execution_snapshot,
    list_execution_adapters,
    reset_execution,
    router as execution_router,
    set_execution_adapter,
    submit_execution_order,
)
from app.api.position_management_api import (
    managed_positions,
    portfolio_risk,
    position_lifecycle,
    refresh_positions,
    reset_managed_positions,
    router as position_management_router,
)
from app.api.strategy_builder import router as strategy_builder_router
from app.api.strategy_execution_api import (
    build_execution_plan,
    execute_plan,
    list_strategies,
    router as strategy_execution_router,
)
from app.api.trade_lifecycle_api import (
    lifecycle_mark_closed,
    lifecycle_mark_entered,
    lifecycle_mark_partial_exit,
    lifecycle_mark_runner,
    router as trade_lifecycle_router,
    trade_lifecycle_reset,
    trade_lifecycle_snapshot,
    update_lifecycle_from_opportunity,
)
from app.api.trade_planner import router as trade_planner_router

# ---------------------------------------------------------------------------
# API imports — portfolio / research / platform
# ---------------------------------------------------------------------------

from app.api.platform import router as platform_router
from app.api.portfolio_intelligence_api import (
    portfolio_intelligence_snapshot,
    router as portfolio_intelligence_router,
)
from app.api.strategy_registry_api import (
    get_research_strategy,
    list_research_strategies,
    router as strategy_registry_router,
    strategy_registry_health,
)


# ---------------------------------------------------------------------------
# App setup
# ---------------------------------------------------------------------------

ROOT = Path(__file__).resolve().parent
STATIC = ROOT / "static"
TEMPLATES = ROOT / "templates"

app = FastAPI(title="Market Intelligence Hub")

app.mount("/static", StaticFiles(directory=str(STATIC)), name="static")
templates = Jinja2Templates(directory=str(TEMPLATES))


# ---------------------------------------------------------------------------
# Direct API route registration — AI / decision / risk
# ---------------------------------------------------------------------------

app.add_api_route("/api/risk/assess", assess_risk, methods=["POST"])
app.add_api_route("/api/ai-decision/analyze", analyze_decision, methods=["POST"])


# ---------------------------------------------------------------------------
# Direct API route registration — research / strategy execution
# ---------------------------------------------------------------------------

app.add_api_route("/api/research/strategies", list_research_strategies, methods=["GET"])
app.add_api_route("/api/research/strategies/health", strategy_registry_health, methods=["GET"])
app.add_api_route(
    "/api/research/strategies/{strategy_id}",
    get_research_strategy,
    methods=["GET"],
)

app.add_api_route("/api/strategy-execution/strategies", list_strategies, methods=["GET"])
app.add_api_route("/api/strategy-execution/plan", build_execution_plan, methods=["POST"])
app.add_api_route("/api/strategy-execution/execute", execute_plan, methods=["POST"])


# ---------------------------------------------------------------------------
# Direct API route registration — market / scanner / technicals
# ---------------------------------------------------------------------------

app.add_api_route("/api/market-data/quote/{symbol}", get_quote, methods=["GET"])
app.add_api_route("/api/market-data/snapshot", get_snapshot, methods=["GET"])

app.add_api_route("/api/scanner/jobs", create_scan_job, methods=["POST"])
app.add_api_route("/api/scanner/jobs/{job_id}", get_scan_job, methods=["GET"])
app.add_api_route("/api/scanner/jobs/{job_id}/run", run_scan_job, methods=["POST"])

app.add_api_route("/api/technical/{symbol}", analyze_symbol, methods=["GET"])


# ---------------------------------------------------------------------------
# Direct API route registration — execution / broker abstraction
# ---------------------------------------------------------------------------

app.add_api_route("/api/execution/adapters", list_execution_adapters, methods=["GET"])
app.add_api_route("/api/execution/adapter", set_execution_adapter, methods=["POST"])
app.add_api_route("/api/execution/snapshot", execution_snapshot, methods=["GET"])
app.add_api_route("/api/execution/reset", reset_execution, methods=["POST"])
app.add_api_route("/api/execution/orders", submit_execution_order, methods=["POST"])


# ---------------------------------------------------------------------------
# Direct API route registration — portfolio / positions / lifecycle
# ---------------------------------------------------------------------------

app.add_api_route(
    "/api/portfolio-intelligence/snapshot",
    portfolio_intelligence_snapshot,
    methods=["GET"],
)

app.add_api_route("/api/positions/managed", managed_positions, methods=["GET"])
app.add_api_route("/api/positions/refresh", refresh_positions, methods=["POST"])
app.add_api_route("/api/positions/reset", reset_managed_positions, methods=["POST"])
app.add_api_route("/api/positions/lifecycle", position_lifecycle, methods=["GET"])
app.add_api_route("/api/positions/portfolio-risk", portfolio_risk, methods=["GET"])

app.add_api_route("/api/trade-lifecycle/snapshot", trade_lifecycle_snapshot, methods=["GET"])
app.add_api_route(
    "/api/trade-lifecycle/opportunity",
    update_lifecycle_from_opportunity,
    methods=["POST"],
)
app.add_api_route("/api/trade-lifecycle/entered", lifecycle_mark_entered, methods=["POST"])
app.add_api_route(
    "/api/trade-lifecycle/partial-exit",
    lifecycle_mark_partial_exit,
    methods=["POST"],
)
app.add_api_route("/api/trade-lifecycle/runner", lifecycle_mark_runner, methods=["POST"])
app.add_api_route("/api/trade-lifecycle/closed", lifecycle_mark_closed, methods=["POST"])
app.add_api_route("/api/trade-lifecycle/reset", trade_lifecycle_reset, methods=["POST"])


# ---------------------------------------------------------------------------
# Router includes — research / risk / scanner / market
# ---------------------------------------------------------------------------

app.include_router(strategy_registry_router)
app.include_router(institutional_risk_router)
app.include_router(scanner_api_router)
app.include_router(watchlist_router)
app.include_router(technical_router)
app.include_router(market_router)
app.include_router(market_data_router)
app.include_router(live_market_data_router)
app.include_router(indicator_router)
app.include_router(backtest_router)


# ---------------------------------------------------------------------------
# Router includes — platform / state / rules / strategy
# ---------------------------------------------------------------------------

app.include_router(platform_router)
app.include_router(state_router)
app.include_router(strategy_builder_router)
app.include_router(rule_engine_router)
app.include_router(legacy_scanner_router)
app.include_router(trade_planner_router)
app.include_router(strategy_execution_router)


# ---------------------------------------------------------------------------
# Router includes — execution / positions / AI / portfolio / lifecycle
# ---------------------------------------------------------------------------

app.include_router(execution_router)
app.include_router(position_management_router)
app.include_router(ai_decision_router)
app.include_router(portfolio_intelligence_router)
app.include_router(trade_lifecycle_router)


# ---------------------------------------------------------------------------
# Page routes
# ---------------------------------------------------------------------------

@app.get("/", response_class=HTMLResponse)
def dashboard(request: Request):
    return templates.TemplateResponse(
        request,
        "dashboard.html",
        {},
    )


@app.get("/workstation", response_class=HTMLResponse)
def workstation_page(request: Request):
    return templates.TemplateResponse(
        request,
        "workstation.html",
        {},
    )


@app.get("/scanner", response_class=HTMLResponse)
def scanner_page(request: Request):
    return templates.TemplateResponse(
        request,
        "workstation.html",
        {},
    )


@app.get("/workstation_v52", response_class=HTMLResponse)
def workstation_v52(request: Request):
    return templates.TemplateResponse(
        request,
        "workstation_v52.html",
        {},
    )


@app.get("/workstation_v53", response_class=HTMLResponse)
def workstation_v53(request: Request):
    return templates.TemplateResponse(
        request,
        "workstation_v53.html",
        {},
    )


@app.get("/workstation_v54", response_class=HTMLResponse)
def workstation_v54(request: Request):
    return templates.TemplateResponse(
        request,
        "workstation_v54.html",
        {},
    )
