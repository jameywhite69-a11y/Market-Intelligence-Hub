```powershell
python -m compileall app
python -m pytest tests
python -c "from app.main import app; print('App import OK')"
```

Manual:
1. Open `/workstation`
2. Verify Broker Manager panel appears.
3. Switch broker context (if available) and confirm update.
