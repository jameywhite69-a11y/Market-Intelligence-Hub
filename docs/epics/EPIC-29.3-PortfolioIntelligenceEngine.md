# Version 29.3 — Portfolio Intelligence Engine

## Objective

Add portfolio-aware decision support so opportunities are evaluated against portfolio heat, risk budget, exposure, and correlation-style risk.

## Delivered Capabilities

- Portfolio Intelligence model.
- Portfolio Intelligence Engine.
- Portfolio heat calculation.
- Risk budget remaining.
- Demo exposure model.
- Correlation risk classification.
- Exposure risk classification.
- Position-size recommendation.
- Portfolio action recommendation.
- Technical API returns `portfolio_intelligence`.
- Opportunity Explorer renders Portfolio Intelligence panel.
- Unit test coverage.

## Notes

This version uses a demo portfolio exposure model. Future broker or paper-trading integration should replace the demo exposure estimates with real positions, buying power, realized/unrealized P&L, and account-level risk.
