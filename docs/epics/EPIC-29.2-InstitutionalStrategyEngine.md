# Version 29.2 — Institutional Strategy Engine

## Objective

Evaluate each opportunity against multiple professional trading strategies simultaneously and identify the best-fitting strategy.

## Delivered Capabilities

- Strategy Matrix model.
- Institutional Strategy Engine.
- Strategy candidates:
  - Trend Following
  - Pullback Continuation
  - Breakout
  - Mean Reversion
  - Momentum
  - Opening Range Breakout
  - Scalping
- Primary strategy selection.
- Secondary strategy selection.
- Avoid strategy flag.
- Strategy agreement classification.
- Strategy confidence.
- Technical API returns `strategy_matrix`.
- Opportunity Explorer renders Institutional Strategy Matrix.
- Unit test coverage.

## Manual Validation

1. Open `/api/technical/BTC?timeframe=15m`.
2. Confirm JSON includes `strategy_matrix`.
3. Open `/scanner`.
4. Run scan.
5. Click a result.
6. Confirm Institutional Strategy Matrix appears in the right panel.
