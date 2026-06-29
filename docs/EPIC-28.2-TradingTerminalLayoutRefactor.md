# Version 28.2 — Trading Terminal Layout Refactor

## Objective

Refactor the workspace into a true trading terminal layout with a compact top dock, dominant ranked results area, persistent right-hand decision panel, and bottom dock for history and scan monitoring.

## Delivered Capabilities

- Terminal header and toolbar.
- Compact top summary strip.
- Collapsible top dock.
- Collapsible bottom dock.
- Persistent right-hand Institutional Decision panel.
- Bottom dock for Opportunity History and Scan Monitor.
- Sticky results header.
- Sticky table headers.
- More vertical room for Ranked Results.
- LocalStorage persistence for dock visibility.
- Keyboard shortcuts:
  - Ctrl+Shift+T: toggle top dock
  - Ctrl+Shift+B: toggle bottom dock
  - Ctrl+Shift+D: toggle decision panel

## Manual Validation

1. Open `/scanner`.
2. Confirm Decision Panel is visible on the right.
3. Confirm top widgets are compressed.
4. Run scan.
5. Confirm results dominate the workspace.
6. Confirm Opportunity History and Scan Monitor are in the bottom dock.
7. Toggle Top Dock, Bottom Dock, and Decision Panel.
8. Click a result and confirm the Decision Panel renders.
9. Confirm no console errors.
