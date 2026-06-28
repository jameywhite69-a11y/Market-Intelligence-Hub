# Indicator Framework 2.0 — Alpha 1

## Objective

Alpha 1 establishes the production framework core for the Indicator subsystem.

## Included

- Exception hierarchy
- IndicatorFactory refinement
- IndicatorEngine orchestration
- Plugin loader
- Automatic discovery contract
- Indicator package structure
- Framework-level tests

## Architecture Rules

- IndicatorEngine orchestrates only.
- Indicator classes perform calculations.
- Indicators derive from BaseIndicator.
- Indicators expose metadata through IndicatorDefinition.
- Factory creates indicators by key.
- Registry exposes metadata.
- Cache stores results by symbol, timeframe, indicator, and parameters.

## Next Alpha

Version 25.2A-alpha.2 will add the first concrete built-in indicators.
