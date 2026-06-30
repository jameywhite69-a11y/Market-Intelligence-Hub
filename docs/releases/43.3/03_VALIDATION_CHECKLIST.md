# Validation Checklist — Version 43.3

## PowerShell

```powershell
python -m compileall app
python -m pytest tests
python -c "from app.main import app; print('App import OK')"
```

## Manual

1. Open `/workstation`
2. Run scanner
3. Click an opportunity
4. Open AI tab
5. Confirm News & Catalyst Intelligence appears
6. Click Add Demo Catalyst
7. Refresh browser
8. Confirm catalyst persists
