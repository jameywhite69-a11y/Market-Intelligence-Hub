# Validation

```powershell
python -m compileall app
python -m pytest tests
python -c "from app.main import app; print('App import OK')"
```

Manual:
1. Open /workstation
2. Open Diagnostics tab
3. Verify Automation Center panel appears
4. Toggle rules and refresh page
5. Verify rule states persist
