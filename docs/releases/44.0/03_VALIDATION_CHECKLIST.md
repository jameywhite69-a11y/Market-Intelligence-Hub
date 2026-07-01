# Validation Checklist — Version 44.0

```powershell
python -m compileall app
python -m pytest tests
python -c "from app.main import app; print('App import OK')"
Select-String app\templates\workstation.html -Pattern "data-dock-tab|data-dock-panel"
Select-String app\templates\base.html -Pattern "institutional_dock_system.css"
```

Browser console:

```javascript
typeof InstitutionalDockSystem
InstitutionalDockSystem.debugState()
InstitutionalDockSystem.activateTab("diagnostics")
```
