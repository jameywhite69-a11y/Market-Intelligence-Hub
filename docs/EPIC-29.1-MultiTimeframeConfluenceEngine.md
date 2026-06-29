# Version 29.1 — Multi-Timeframe Confluence Engine

## Objective

Add institutional multi-timeframe confluence analysis so every opportunity is evaluated against higher- and lower-timeframe context.

## Delivered Capabilities

- Confluence score model.
- Multi-Timeframe Confluence Engine.
- Weighted timeframe model:
  - 5m = 10%
  - 15m = 20%
  - 1h = 30%
  - 4h = 25%
  - 1d = 15%
- Alignment rating.
- Dominant direction detection.
- Conflict detection.
- Counter-trend detection.
- Confidence adjustment projection.
- Technical API returns `confluence`.
- Opportunity Explorer renders the Confluence panel.
- Unit test coverage.

## Manual Validation

1. Open `/api/technical/BTC?timeframe=15m`.
2. Confirm JSON includes `confluence`.
3. Open `/scanner`.
4. Run scan.
5. Click a result.
6. Confirm Multi-Timeframe Confluence appears in the right panel.
