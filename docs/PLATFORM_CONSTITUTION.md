# Market Intelligence Hub Platform Constitution

## Purpose

This document defines the architectural rules that guide all future development of Market Intelligence Hub.

## Rule 1 — Single Source of Truth

Indicators must only be calculated by the Indicator Framework.

No scanner, chart, AI module, strategy engine, or broker adapter should implement duplicate EMA, RSI, ATR, VWAP, MACD, ADX, or other indicator calculations.

## Rule 2 — Event-Driven Communication

Subsystems should communicate through the Platform Event Bus whenever possible.

## Rule 3 — Dependency Injection

Shared services should be registered and resolved through the Service Registry.

## Rule 4 — Plugin Architecture

New indicators, strategies, scanners, brokers, and AI modules should be added as plugins or modular components, not by modifying core orchestration logic.

## Rule 5 — Test Before Merge

Every pull request must pass:

- Automated tests
- Python compile
- Project Doctor
- CI validation

## Rule 6 — Documentation Required

Architecture changes must update documentation.

## Rule 7 — Releasable Main Branch

The `main` branch must always represent a stable releasable version.

## Rule 8 — No Generated Files in Git

Generated files such as `__pycache__`, `.pyc`, `.pytest_cache`, and temporary runtime files must not be committed.

## Rule 9 — Indicators Are Plugins

IndicatorEngine orchestrates. Individual indicators calculate.

## Rule 10 — No Major Architecture Change Without ADR

Major architectural decisions must be documented in `docs/adr/`.