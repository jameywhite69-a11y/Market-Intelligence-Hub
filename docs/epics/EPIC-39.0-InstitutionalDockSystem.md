# Version 39.0 — Institutional Dock System

## Objective

Replace the crowded right-hand vertical stack with a professional tabbed dock system.

## Delivered

- Tabbed right dock.
- Execution tab:
  - Broker Adapter
  - Trade Context
  - Order Ticket
  - Trading Terminal
  - Paper Trading
- Positions tab:
  - Position Management
  - Portfolio Risk
  - Position Lifecycle
- AI tab:
  - AI Decision Stack / Opportunity Intelligence
- Diagnostics tab:
  - Core Diagnostics
  - Event Diagnostics
  - Scanner Diagnostics
- Persistent active tab using localStorage.
- Dock tab event publication through EventBus.

## Manual Validation

1. Open `/workstation`.
2. Confirm right panel shows tabs:
   - Execution
   - Positions
   - AI
   - Diagnostics
3. Click each tab.
4. Run scan.
5. Select result.
6. Submit paper order.
7. Confirm Execution and Positions tabs update.
8. Refresh page and confirm last selected tab is restored.
