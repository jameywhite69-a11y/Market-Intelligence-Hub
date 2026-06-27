# Market Intelligence Hub v23.2

CSV Market Data Import Tools release.

## Built on
v23.1 Real Market Data Layer.

## Added

- CSV upload endpoint.
- CSV sample generator.
- CSV validation endpoint.
- Market data diagnostics endpoint.
- Browser upload tools in Market Data workspace.
- Sample CSV creation for active symbol.
- Diagnostics view for imported files.
- `python-multipart` dependency for file uploads.

## New APIs

```text
POST /api/market-data/upload-csv
POST /api/market-data/sample-csv
GET  /api/market-data/validate-csv/{filename}
GET  /api/market-data/diagnostics
```

## Run

Double-click:

`start_v23_2.bat`

Then open:

http://127.0.0.1:8000
