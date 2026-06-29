# Version 35.0 — Architecture Stabilization

## Objective

Stabilize the workstation around a single event-driven scanner lifecycle.

## Delivered Capabilities

- Scanner Pipeline owns scan execution.
- Pipeline Subscribers own UI refreshes.
- Scanner Orchestrator is now a thin event binder.
- Core Bootstrap registers pipeline subscribers.
- Run Scan follows a clean lifecycle:
  - scan:started
  - scan:job-created
  - scan:completed
  - scan:failed

## Manual Validation

1. Open `/workstation`.
2. Confirm Core Diagnostics shows modules started.
3. Click Run Scan.
4. Confirm results render.
5. Confirm only one scan job pair per click.
6. Click result.
7. Confirm AI and trade context update.
8. Submit paper order.
9. Confirm paper/terminal panels refresh.
