# Validation

```powershell
python -m compileall app
python -m pytest tests
python -c "from app.main import app; print('App import OK')"
Select-String app\templates\base.html -Pattern "startup_ownership_analyzer.css"
Select-String app\templates\workstation.html -Pattern "startup_ownership|startupOwnershipPanel"
```

Browser console:

```javascript
typeof TIOSStartupOwnershipAnalyzer
TIOSStartupOwnershipAnalyzer.report()
TIOSStartupOwnershipAnalyzer.detectConflicts()
TIOSStartupOwnershipAnalyzer.panelSnapshot()
```
