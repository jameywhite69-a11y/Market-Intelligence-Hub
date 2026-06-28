# Market Intelligence Hub Architecture

## Purpose

Market Intelligence Hub is a modular trading platform built around shared market data, indicator, scanner, strategy, AI, charting, and execution subsystems.

## Architectural Principles

- Single source of truth for indicators
- Shared market data model
- Event-driven communication
- Dependency injection through service registry
- Plugin-based extensibility
- Tests before merge
- Releasable main branch

## Core Layers

### Market Data Layer

Responsible for transforming raw OHLCV bars into standardized domain models.

Components:

- PriceSeries
- SeriesBuilder
- SeriesValidator

### Indicator Framework

Responsible for all indicator calculations.

Components:

- BaseIndicator
- IndicatorDefinition
- IndicatorResult
- IndicatorRegistry
- IndicatorFactory
- IndicatorCache
- IndicatorEngine
- PluginLoader

### Scanner Engine

Responsible for scanning symbols, timeframes, and indicators to identify opportunities.

Planned components:

- ScannerManager
- Watchlist
- ScanJob
- ScanResult
- RankingEngine

### Strategy Engine

Responsible for turning indicator and scanner data into trade logic.

Planned components:

- StrategyDefinition
- RuleEngine
- SignalEngine
- RiskManager

### AI Lab

Responsible for analysis, explanation, and optimization.

Planned components:

- MarketSummaryEngine
- StrategyExplainer
- SignalConfidenceEngine

### Broker Execution

Responsible for paper trading and live broker integrations.

Planned components:

- BrokerAdapter
- OrderManager
- PositionManager
- RiskControls

## Data Flow

```text
Raw Bars
   ↓
SeriesBuilder
   ↓
PriceSeries
   ↓
SeriesValidator
   ↓
IndicatorEngine
   ↓
IndicatorFactory
   ↓
Indicator Plugin
   ↓
IndicatorResult
   ↓
Scanner / Strategy / Charts / AI / Backtester