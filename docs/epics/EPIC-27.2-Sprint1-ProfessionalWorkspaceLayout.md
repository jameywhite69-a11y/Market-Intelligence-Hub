# Version 27.2 — Sprint 1: Professional Workspace Layout

## Objective

Polish the scanner into a professional trading workstation layout before broker integration.

## Delivered Capabilities

- Professional workspace header.
- Wider default Institutional Decision panel.
- Resizable left and right panels.
- Persisted panel widths using localStorage.
- Expanded institutional results grid.
- Workspace keyboard shortcuts:
  - F5: run scan
  - Ctrl+1: focus watchlists
  - Ctrl+2: focus results
  - Ctrl+3: focus decision panel
  - Ctrl+4: focus opportunity queue
- Improved opportunity queue visual hierarchy.
- Improved portfolio summary visual hierarchy.
- Responsive fallback for smaller screens.

## Manual Validation

1. Open `/scanner`.
2. Confirm the right decision panel is wider.
3. Drag left and right panel dividers.
4. Refresh and confirm panel widths persist.
5. Press F5 and confirm scan runs.
6. Press Ctrl+1/Ctrl+2/Ctrl+3/Ctrl+4 and confirm focus movement.
7. Run scan and confirm expanded results grid still works.
8. Click a row and confirm the Institutional Decision panel still works.
