from pathlib import Path
from fastapi import FastAPI
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles

from app.api.market import router as market_router
from app.api.state import router as state_router
from app.api.strategy_builder import router as strategy_builder_router
from app.api.rule_engine import router as rule_engine_router
from app.api.scanner import router as scanner_router
from app.api.trade_planner import router as trade_planner_router
from app.api.platform import router as platform_router
from app.api.backtest import router as backtest_router
from app.api.market_data import router as market_data_router
from app.api.indicators import router as indicator_router

app = FastAPI(title="Market Intelligence Hub v19 Refactor")

ROOT = Path(__file__).resolve().parent
STATIC = ROOT / "static"

app.mount("/static", StaticFiles(directory=str(STATIC)), name="static")

app.include_router(market_router)
app.include_router(state_router)
app.include_router(strategy_builder_router)
app.include_router(rule_engine_router)
app.include_router(scanner_router)
app.include_router(trade_planner_router)
app.include_router(platform_router)
app.include_router(backtest_router)
app.include_router(market_data_router)
app.include_router(indicator_router)


@app.get("/", response_class=HTMLResponse)
def index():
    return (STATIC / "index.html").read_text(encoding="utf-8")
