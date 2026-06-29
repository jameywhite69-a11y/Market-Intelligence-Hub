# Version 26.2 — Epic 1: Live Scanner

## Objective

Deliver the first complete end-to-end user-facing feature in Market Intelligence Hub.

A user should be able to open the Scanner workspace, select symbols/timeframes/indicators, run a scan, and view ranked results in the browser.

---

## User Flow

1. User opens `/scanner`.
2. User selects a watchlist.
3. User selects timeframes.
4. User selects indicators.
5. User clicks `Run Scan`.
6. Frontend creates a scan job.
7. Frontend runs the job.
8. Backend executes the scanner.
9. Results are ranked.
10. Frontend displays ranked results.

---

## Existing Backend

Already available:

- `ScannerManager`
- `ScanRequest`
- `ScanJob`
- `ScanResult`
- `Watchlist`
- `WatchlistManager`
- `IndicatorPipeline`
- `RankingEngine`
- `MarketDataProvider`
- `DemoMarketDataProvider`
- `Scanner REST API`

Existing endpoints:

```text
POST /api/scanner/jobs
POST /api/scanner/jobs/{job_id}/run
GET  /api/scanner/jobs/{job_id}