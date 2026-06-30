# Validation Checklist — Version 43.1

```powershell
python -m compileall app
python -m pytest tests
python -c "from app.main import app; print('App import OK')"
```

Manual validation:

1. Open `/workstation`
2. Submit a paper order
3. Open Diagnostics tab
4. Confirm Trade Journal captured the order
5. Add a manual note
6. Refresh browser
7. Confirm journal persists
