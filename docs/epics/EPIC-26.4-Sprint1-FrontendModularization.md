# Version 26.4 — Sprint 1: Front-End Modularization

## Objective

Split the growing scanner frontend into focused JavaScript modules without changing user-facing functionality.

## Modules

- `scanner_state.js` — shared scanner state.
- `scanner_events.js` — lightweight event helper.
- `scanner_dom.js` — DOM references.
- `scanner_utils.js` — shared helper functions.
- `scanner_status.js` — status/loading UI.
- `watchlist_manager.js` — watchlist UI integration.
- `opportunity_panel.js` — opportunity inspector.
- `scanner_results.js` — result grid rendering and selection.
- `scanner_filters.js` — filtering and sorting.
- `scanner_diagnostics.js` — diagnostics panel.
- `scanner_export.js` — CSV export.
- `scanner_live.js` — auto-refresh lifecycle.
- `scanner_orchestrator.js` — bootstrapping and scan execution.

## Acceptance Criteria

- Existing scanner functionality remains intact.
- Watchlists still load and scan.
- Sorting/filtering still works.
- Live refresh still works.
- CSV export still works.
- Browser console has no errors.
- Automated tests pass.
