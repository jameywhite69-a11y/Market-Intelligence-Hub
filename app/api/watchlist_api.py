from __future__ import annotations

from fastapi import APIRouter, HTTPException

from app.engines.scanner.watchlist import Watchlist
from app.engines.scanner.watchlist_manager import watchlist_manager

router = APIRouter(prefix="/api/watchlists", tags=["watchlists"])


@router.get("")
def list_watchlists() -> dict:
    return {
        "watchlists": [watchlist.model_dump() for watchlist in watchlist_manager.list()]
    }


@router.post("")
def create_watchlist(watchlist: Watchlist) -> dict:
    if not watchlist.name.strip():
        raise HTTPException(status_code=400, detail="Watchlist name is required.")

    created = watchlist_manager.create(watchlist)
    return created.model_dump()


@router.get("/{name}")
def get_watchlist(name: str) -> dict:
    watchlist = watchlist_manager.get(name)

    if watchlist is None:
        raise HTTPException(status_code=404, detail="Watchlist not found.")

    return watchlist.model_dump()


@router.delete("/{name}")
def delete_watchlist(name: str) -> dict:
    watchlist_manager.delete(name)
    return {"deleted": name}


@router.post("/{name}/symbols")
def add_symbol(name: str, payload: dict) -> dict:
    symbol = str(payload.get("symbol", "")).strip()

    if not symbol:
        raise HTTPException(status_code=400, detail="Symbol is required.")

    if watchlist_manager.get(name) is None:
        raise HTTPException(status_code=404, detail="Watchlist not found.")

    watchlist = watchlist_manager.add_symbol(name, symbol)
    return watchlist.model_dump()


@router.delete("/{name}/symbols/{symbol}")
def remove_symbol(name: str, symbol: str) -> dict:
    if watchlist_manager.get(name) is None:
        raise HTTPException(status_code=404, detail="Watchlist not found.")

    watchlist = watchlist_manager.remove_symbol(name, symbol)
    return watchlist.model_dump()


@router.post("/seed")
def seed_default_watchlists() -> dict:
    if watchlist_manager.get("Tech") is None:
        watchlist_manager.create(
            Watchlist(name="Tech", symbols=["AAPL", "MSFT", "NVDA"], description="Large-cap technology")
        )

    if watchlist_manager.get("Crypto") is None:
        watchlist_manager.create(
            Watchlist(name="Crypto", symbols=["BTC", "ETH", "SOL"], description="Major crypto assets")
        )

    return {
        "watchlists": [watchlist.model_dump() for watchlist in watchlist_manager.list()]
    }
