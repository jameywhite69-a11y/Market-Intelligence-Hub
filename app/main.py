from pathlib import Path

from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates

from app.api.backtest import router as backtest_router
from app.api.indicators import router as indicator_router
from app.api.market import router as market_router
from app.api.market_data import router as market_data_router
from app.api.platform import router as platform_router
from app.api.rule_engine import router as rule_engine_router
from app.api.scanner import router as legacy_scanner_router
from app.api.scanner_api import create_scan_job, get_scan_job, run_scan_job
from app.api.scanner_api import router as scanner_api_router
from app.api.state import router as state_router
from app.api.strategy_builder import router as strategy_builder_router
from app.api.technical_analysis import analyze_symbol
from app.api.technical_analysis import router as technical_router
from app.api.trade_planner import router as trade_planner_router
from app.api.watchlist_api import router as watchlist_router
from app.api.execution_api import router as execution_router

ROOT = Path(__file__).resolve().parent
STATIC = ROOT / "static"
TEMPLATES = ROOT / "templates"

app = FastAPI(title="Market Intelligence Hub")

app.mount("/static", StaticFiles(directory=str(STATIC)), name="static")

templates = Jinja2Templates(directory=str(TEMPLATES))

# Direct API route registration.
# This is used because this environment has shown router inclusion quirks
# where included router entries may appear as _IncludedRouter instead of APIRoute.
app.add_api_route(
    "/api/scanner/jobs",
    create_scan_job,
    methods=["POST"],
)

app.add_api_route(
    "/api/scanner/jobs/{job_id}",
    get_scan_job,
    methods=["GET"],
)

app.add_api_route(
    "/api/scanner/jobs/{job_id}/run",
    run_scan_job,
    methods=["POST"],
)

app.add_api_route(
    "/api/technical/{symbol}",
    analyze_symbol,
    methods=["GET"],
)

# Keep router includes for compatibility with existing application modules.
app.include_router(scanner_api_router)
app.include_router(watchlist_router)
app.include_router(technical_router)
app.include_router(market_router)
app.include_router(state_router)
app.include_router(strategy_builder_router)
app.include_router(rule_engine_router)
app.include_router(legacy_scanner_router)
app.include_router(trade_planner_router)
app.include_router(platform_router)
app.include_router(backtest_router)
app.include_router(market_data_router)
app.include_router(indicator_router)
app.include_router(execution_router)

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