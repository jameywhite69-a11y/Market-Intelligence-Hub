# Version 37.0 — Position Management Engine

## Objective
Add a paper-position lifecycle manager that tracks stops, targets, trailing stop levels, and R-multiple state.

## Delivered
- Position management engine.
- Managed position state model.
- Managed rule model.
- API routes:
  - `/api/positions/managed`
  - `/api/positions/refresh`
  - `/api/positions/reset`
- Position Management panel.
- Lifecycle labels: Filled, TP1 Zone, Runner, Closed.
