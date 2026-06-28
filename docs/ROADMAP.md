# Market Intelligence Hub Roadmap

## Current Status

### Version 25.4 — Complete

Market Intelligence Hub now has a stable platform foundation.

Completed:

- Platform Core
- Market Data Subsystem
- Indicator Framework
- Trend Indicator Library
- Engineering Process
- Release Workflow

---

## Version 26.0 — Professional Scanner Engine

### Objective

Build the first major trader-facing subsystem.

### PR 1 — Scanner Core

- ScannerManager
- ScanRequest
- ScanJob
- ScanResult
- Basic unit tests

### PR 2 — Watchlist Subsystem

- Watchlist model
- Symbol groups
- Editable watchlists
- Persistence-ready structure

### PR 3 — Indicator Pipeline

- Run IndicatorEngine across symbols and timeframes
- Consume PriceSeries
- Return IndicatorResult collections

### PR 4 — Ranking Engine

- Score scan results
- Sort opportunities
- Identify strongest setups

### PR 5 — REST API

- Scanner endpoints
- Watchlist endpoints
- Scan result endpoints

### PR 6 — Dashboard Integration

- Connect scanner results to UI
- Display ranked symbols
- Show indicator summaries

---

## Version 26.1 — Strategy Engine

- Rule builder
- Signal engine
- Risk manager
- Position sizing
- Backtest compatibility

---

## Version 26.2 — Indicator Library Expansion

Momentum:

- RSI
- MACD
- ADX / DMI
- Stochastic
- CCI

Volatility:

- ATR
- Bollinger Bands
- Keltner Channels

Volume:

- VWAP
- OBV
- MFI

Market Structure:

- BOS
- CHOCH
- Fair Value Gap
- Swing High / Low
- Pivot Levels

---

## Version 26.3 — AI Lab

- Market summaries
- Signal explanations
- Strategy diagnostics
- Confidence scoring

---

## Version 26.4 — Broker Execution

- Paper trading
- Order manager
- Broker adapters
- Risk controls

---

## Version 26.5 — Professional Workspace

- Multi-panel layouts
- Watchlist editor
- Scanner dashboard
- Strategy dashboard
- Alert center

---

## Version 27 — Expansion

- Cloud sync
- Plugin marketplace
- Mobile companion API
- Portfolio analytics
- Advanced backtesting

---

## Development Rules

- Architecture is frozen unless an ADR is approved.
- Indicators must use IndicatorEngine.
- Raw market data must become PriceSeries.
- Scanner and Strategy modules consume IndicatorResult.
- Every PR must include tests.
- Every release must update CHANGELOG.md.