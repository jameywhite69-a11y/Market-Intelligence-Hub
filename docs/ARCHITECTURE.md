# Market Intelligence Hub v22 Architecture

Version 22 introduces an enterprise-style structure.

## Core

- `app/core/event_bus.py`
- `app/core/settings.py`
- `app/core/plugin_manager.py`
- `app/core/workspace_manager.py`

## Engines

- `app/engines/data`
- `app/engines/scanner`
- `app/engines/strategy`
- `app/engines/trading`
- `app/engines/broker`
- `app/engines/ai`

## Adapters

- `app/adapters/market_data`
- `app/adapters/brokers`

## API

- Existing feature APIs remain intact.
- New platform API:
  - `/api/platform/status`
  - `/api/platform/events`
  - `/api/platform/plugins`
  - `/api/platform/workspaces`
  - `/api/platform/settings`

## Goal

Future features should plug into the engines/adapters/plugin structure instead of expanding one large file.
