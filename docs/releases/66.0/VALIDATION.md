# Validation

```powershell
python -m compileall app
python -c "from app.main import app; print('App import OK')"
Select-String app\templates\base.html -Pattern "live_order_management_v66.css"
Select-String app\templates\workstation\_center_workspace.html -Pattern "liveOrderManagerPanelV66|bracketOrderPanelV66|orderMonitorPanelV66"
Select-String app\templates\workstation\_script_loader.html -Pattern "live_order_manager_v66|bracket_order_panel_v66|order_monitor_v66"
```

Browser console:

```javascript
typeof LiveOrderManagerV66
typeof BracketOrderPanelV66
typeof OrderMonitorV66
LiveOrderManagerV66.snapshot()
```
