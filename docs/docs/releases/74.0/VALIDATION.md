# Validation

```powershell
python -m compileall app
python -c "from app.main import app; print('App import OK')"
Select-String app\templates\base.html -Pattern "realtime_data_sync_v74.css"
Select-String app\templates\workstation\_center_workspace.html -Pattern "realtimeDataBusPanelV74|realtimeQuoteTapePanelV74|dataSyncHealthPanelV74"
Select-String app\templates\workstation\_script_loader.html -Pattern "realtime_data_bus_v74|realtime_quote_tape_v74|data_sync_health_panel_v74"
```

Browser console:

```javascript
typeof RealtimeDataBusV74
typeof RealtimeQuoteTapeV74
typeof DataSyncHealthPanelV74
RealtimeDataBusV74.tick()
```
