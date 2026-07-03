# Validation

```powershell
python -m compileall app
python -c "from app.main import app; print('App import OK')"
Select-String app\templates\base.html -Pattern "production_polish_v71.css"
Select-String app\templates\workstation\_center_workspace.html -Pattern "productionPolishPanelV71|runtimeHealthMonitorPanelV71"
Select-String app\templates\workstation\_script_loader.html -Pattern "production_polish_controller_v71|runtime_health_monitor_v71"
```

Browser console:

```javascript
typeof ProductionPolishControllerV71
typeof RuntimeHealthMonitorV71
RuntimeHealthMonitorV71.check()
```
