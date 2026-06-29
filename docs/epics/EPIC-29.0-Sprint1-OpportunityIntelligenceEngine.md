# Version 29.0 — Sprint 1: Opportunity Intelligence Engine

## Objective

Begin the Institutional Intelligence Platform by adding an analyst-style report layer above the existing technical, strategy, confidence, decision, and trade-planning engines.

## Delivered Capabilities

- Institutional Intelligence package.
- Opportunity Intelligence Engine.
- Opportunity Intelligence Report model.
- Analyst rating.
- Institutional score.
- Setup quality.
- Preferred strategy.
- Entry-zone report.
- Exit-plan report.
- Risk assessment.
- Bullish case / bearish case.
- Trade-plan narrative.
- Action items.
- Technical API now returns `opportunity_intelligence`.
- Opportunity Explorer renders the new Opportunity Intelligence card.
- Unit test coverage.

## Manual Validation

1. Open `/api/technical/BTC?timeframe=15m`.
2. Confirm JSON includes `opportunity_intelligence`.
3. Open `/scanner`.
4. Run scan.
5. Click a result.
6. Confirm Opportunity Intelligence appears at the top of the right panel.
