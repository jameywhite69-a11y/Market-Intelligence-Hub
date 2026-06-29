from __future__ import annotations

from fastapi import APIRouter, WebSocket, WebSocketDisconnect

from app.market_data.live_provider import live_market_data_provider

router = APIRouter(prefix="/api/market-data", tags=["market-data"])


@router.get("/quote/{symbol}")
def get_quote(symbol: str) -> dict:
    return live_market_data_provider.quote(symbol).model_dump()


@router.get("/snapshot")
def get_snapshot(symbols: str = "BTC,ETH,SOL") -> dict:
    parsed = [item.strip() for item in symbols.split(",") if item.strip()]
    return live_market_data_provider.snapshot(parsed).model_dump()


@router.websocket("/stream")
async def stream_market_data(websocket: WebSocket):
    import asyncio

    await websocket.accept()

    try:
        initial = await websocket.receive_json()
        symbols = initial.get("symbols", ["BTC", "ETH", "SOL"])
        interval = float(initial.get("interval", 2.0))

        while True:
            snapshot = live_market_data_provider.snapshot(symbols)
            await websocket.send_json(snapshot.model_dump())
            await asyncio.sleep(max(1.0, interval))
    except WebSocketDisconnect:
        return
