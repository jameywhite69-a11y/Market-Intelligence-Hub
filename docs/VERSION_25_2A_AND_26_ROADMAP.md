# Market Intelligence Hub

## Product Roadmap

### Version 25 — Platform Foundation

**Status:** In Progress

### 25.1 Platform Core

* Repository migration to Git
* Feature branch workflow
* Event Bus
* Service Registry (Dependency Injection)
* Developer scripts
* GitHub Actions CI
* Project Doctor
* Documentation framework

**Acceptance Criteria**

* All automated tests pass.
* CI passes on every push.
* Project Doctor reports a healthy environment.
* Repository follows documented standards.

---

### 25.2A Complete Indicator Framework

#### Objective

Build one reusable indicator subsystem used by every engine in the platform.

#### Framework

* BaseIndicator
* IndicatorFactory
* IndicatorRegistry
* IndicatorEngine
* IndicatorCache
* Plugin discovery
* Automatic registration

#### Core Indicator Library

Moving Average

* EMA
* SMA
* WMA
* HMA
* VWMA

Momentum

* RSI
* MACD
* ADX
* Stochastic
* CCI

Volatility

* ATR
* Bollinger Bands
* Keltner Channels

Volume

* VWAP
* OBV

Market Structure

* BOS
* CHOCH
* Fair Value Gap
* Swing High / Low
* Pivot Levels

#### Integration

Every indicator must be available through:

* Scanner Engine
* Strategy Engine
* Charts
* Backtester
* AI Lab
* REST API

#### Quality Gates

* 100% unit tests
* Integration tests
* Cache validation
* Documentation
* Benchmark tests

#### Acceptance Criteria

* Every indicator derives from BaseIndicator.
* Indicators register automatically.
* IndicatorEngine never contains indicator-specific calculation logic.
* Scanner, Strategy, Charts, AI, and Backtester all consume the same IndicatorEngine.
* No duplicated indicator calculations exist across the project.
* CI passes with full test suite.

---

# Version 26 — Commercial Trading Platform

## Phase 1 — Market Data

* Multi-provider architecture
* Real-time streaming
* Historical data
* Replay mode
* Tick aggregation
* Data validation

## Phase 2 — Scanner Engine

* Multi-symbol scanning
* Multi-timeframe scanning
* Parallel execution
* Watchlists
* Ranking engine
* Alert engine

## Phase 3 — Strategy Engine

* Rule Builder
* Strategy plugins
* Position sizing
* Risk management
* Walk-forward testing

## Phase 4 — AI Lab

* Strategy analysis
* Market summaries
* Indicator explanations
* Signal confidence
* Trade journal analysis

## Phase 5 — Charts

* Professional chart workspace
* Multi-chart layouts
* Drawing tools
* Heat maps
* Order flow overlays

## Phase 6 — Portfolio

* Holdings
* Performance
* Risk metrics
* Journal
* Analytics

## Phase 7 — Broker Execution

* Paper Trading
* Interactive Brokers
* TradeStation
* Coinbase
* Alpaca
* Tradovate
* Order Management

## Phase 8 — Workspace

* Saved layouts
* Plugin manager
* User preferences
* Keyboard shortcuts
* Themes

## Phase 9 — Professional Features

* Watchlist Manager
* Workspace synchronization
* Multi-monitor support
* Notifications
* Mobile companion API

---

## Product Definition

Market Intelligence Hub is a modular, event-driven trading platform built around a shared Indicator Framework and a unified Market Data Pipeline. Every subsystem—scanner, strategy engine, charts, AI, backtesting, and broker execution—consumes the same core services, ensuring consistency, extensibility, and maintainability.

Every release must include:

* Source code
* Automated tests
* Documentation
* Release notes
* Version metadata
* Successful CI validation
