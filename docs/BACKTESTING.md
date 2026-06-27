# Backtesting Foundation

v22.2 adds the first lightweight backtesting engine.

## Endpoint

```text
POST /api/backtest/run
```

## Current behavior

- Uses demo OHLCV data.
- Uses simplified EMA29/EMA54 pullback/reclaim logic.
- Tracks trades, win rate, net P/L, return %, profit factor, and equity curve.

## Future upgrades

- Real historical data.
- Rule graph exact evaluation.
- Commission/slippage.
- Position sizing models.
- Walk-forward analysis.
- Monte Carlo simulation.
