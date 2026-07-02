# Validation

```powershell
python -m compileall app
python -m pytest tests
python -c "from app.main import app; print('App import OK')"
Select-String app\templates\base.html -Pattern "startup_trace.css"
Select-String app\templates\workstation.html -Pattern "startup_trace|startupTracePanel"
```

Browser console:

```javascript
typeof TIOSStartupTrace
TIOSStartupTrace.report()
TIOSStartupTrace.panelSnapshot()
```
