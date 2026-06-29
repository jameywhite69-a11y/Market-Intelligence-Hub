# Version 32.1 — Scanner API Recovery

## Objective

Restore the scanner pipeline after the Professional Trading Terminal UI was completed.

## Delivered Fixes

- Replaced `scanner_api_client.js` with a stable client targeting:
  - `POST /api/scanner/jobs`
  - `POST /api/scanner/jobs/{job_id}/run`
  - `GET /api/scanner/jobs/{job_id}`
- Replaced `scanner_orchestrator.js` with the aligned workstation-safe version.
- Restored scanner error handling with meaningful messages.
- Ensured failed scan states no longer leave the UI stuck in loading state.
- Included canonical `scanner_api.py` router for verification/recovery if needed.

## Manual Validation

1. Open `/workstation`.
2. Press Ctrl+F5.
3. Click Run Scan.
4. Confirm server logs:
   - `POST /api/scanner/jobs 200 OK`
   - `POST /api/scanner/jobs/.../run 200 OK`
5. Click a result.
6. Confirm:
   - `GET /api/technical/BTC?timeframe=15m 200 OK`
7. Buy paper position and confirm terminal updates.
