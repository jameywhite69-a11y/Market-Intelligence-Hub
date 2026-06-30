# Validation Checklist — Version 42.8

## PowerShell validation

```powershell
python -m compileall app
python -m pytest tests
python -c "from app.main import app; print('App import OK')"
```

## Manual validation

1. Start MIH.
2. Open `/workstation`.
3. Confirm professional status bar renders.
4. Open Diagnostics tab.
5. Confirm Workspace Profiles panel appears.
6. Save a profile.
7. Refresh browser.
8. Confirm profile can be restored.
9. Confirm Commercial Readiness panel appears.
