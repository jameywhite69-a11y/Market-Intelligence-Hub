# Version 40.0 — Live Market Data Engine

## Objective

Add a live market data abstraction with HTTP snapshots and WebSocket streaming.

## Delivered

- Demo live market data provider.
- Quote model.
- Snapshot model.
- HTTP quote endpoint.
- HTTP snapshot endpoint.
- WebSocket streaming endpoint.
- Live market data client.
- Live market data panel.
- EventBus event: `market-data:tick`.
- WorkspaceStore key: `marketDataSnapshot`.

## New APIs

- `GET /api/market-data/quote/{symbol}`
- `GET /api/market-data/snapshot?symbols=BTC,ETH,SOL`
- `WS /api/market-data/stream`
