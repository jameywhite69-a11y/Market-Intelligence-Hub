# Validation Checklist — Version 45.0

## PowerShell

```powershell
python -m compileall app
python -m pytest tests
python -c "from app.main import app; print('App import OK')"
```

## Browser Console

```javascript
typeof UnifiedOpportunityStore
typeof WorkspaceSynchronizationEngine
typeof GlobalEventRecorder
typeof WorkspaceHealthDashboard
```

Each should return:

```text
"object"
```

## Manual

1. Open `/workstation`.
2. Open Diagnostics tab.
3. Confirm Workspace Health panel appears.
4. Run scan.
5. Click an opportunity.
6. Confirm health/event recorder updates.
