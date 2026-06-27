# Real Market Data Layer

v23.1 introduces a provider-based market data layer.

## Providers

- `demo` — built-in simulated data
- `csv` — local CSV historical files
- `alpaca` — adapter slot
- `polygon` — adapter slot
- `coinbase` — adapter slot

## API

```text
GET  /api/market-data/status
GET  /api/market-data/providers
POST /api/market-data/provider
GET  /api/market-data/imports
```

## CSV Import

Place CSV files here:

```text
app/storage/imports/
```

Accepted file names:

```text
NVDA.csv
NVDA_15m.csv
BTCUSD.csv
BTCUSD_1h.csv
```

Expected columns:

```text
time,open,high,low,close,volume
```

Aliases are accepted:

```text
date,o,h,l,c,v
```

## Fallback behavior

If a selected real provider is not configured or CSV data is missing, the platform automatically falls back to demo data so charts and scanners keep working.
