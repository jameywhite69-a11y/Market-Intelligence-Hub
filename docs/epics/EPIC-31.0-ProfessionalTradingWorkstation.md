# Version 31.0 — Professional Trading Workstation

## Objective

Rebuild the UI shell into a professional workstation layout while preserving all backend engines and paper trading.

## Delivered Capabilities

- New dedicated `workstation.html` shell.
- Three-column workstation:
  - Left dock: watchlists, scan controls, live scan, filters.
  - Center dock: metrics, heat map, live opportunities, ranked results, history, diagnostics.
  - Right dock: paper trading and AI decision stack.
- Execution ribbon with equity, cash, open P&L, and paper status.
- Workstation CSS isolated from legacy scanner recovery styles.
- Paper trading panel emits updates so the top ribbon refreshes.
- Existing engines untouched.

## Manual Validation

1. Add `/workstation` route to `app/main.py`.
2. Open `/workstation`.
3. Run scan.
4. Click a result.
5. Confirm right AI Decision Stack updates.
6. Click Buy/Sell.
7. Confirm Paper Trading panel and top ribbon update.
