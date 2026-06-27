# Version 25.2A — Complete Indicator Framework

## Objective

Deliver the Indicator Framework as the first production-standard subsystem in Market Intelligence Hub.

## Scope

### Framework Core

- BaseIndicator
- IndicatorFactory
- IndicatorRegistry
- IndicatorCache
- IndicatorEngine
- Plugin discovery
- Automatic registration

### Core Indicator Library

- EMA
- SMA
- WMA
- HMA
- VWMA
- RSI
- MACD
- ADX
- ATR
- Bollinger Bands
- VWAP
- OBV

### Platform Integration

- Scanner Engine
- Strategy Engine
- Charts
- AI Lab
- Backtester
- REST API

## Acceptance Criteria

- Every indicator derives from BaseIndicator.
- IndicatorEngine contains no indicator-specific calculation logic.
- IndicatorFactory creates indicators by key.
- IndicatorRegistry exposes indicator metadata.
- IndicatorCache caches by symbol, timeframe, indicator, and parameters.
- Scanner, Strategy, Charts, AI, Backtester, and API consume the same IndicatorEngine.
- No duplicated indicator calculations exist outside the framework.
- All indicators have unit tests.
- Engine has integration tests.
- Documentation is updated.
- Project Doctor passes.
- CI passes.

## Definition of Done

Version 25.2A is complete only when:

- Source code is implemented.
- Unit tests pass.
- Integration tests pass.
- API tests pass.
- Documentation is complete.
- Release notes are complete.
- CI is green.
- Project Doctor reports healthy.
- The feature branch is merged through pull request.