# Validation

```powershell
python -m compileall app
python -c "from app.main import app; print('App import OK')"
Select-String app\templates\base.html -Pattern "multi_broker_abstraction_v92.css"
Select-String app\templates\workstation\_center_workspace.html -Pattern "multiBrokerAbstractionPanelV92|brokerConnectionCenterPanelV92|brokerPreflightPanelV92"
Select-String app\templates\workstation\_script_loader.html -Pattern "multi_broker_abstraction_v92|broker_connection_center_v92|broker_preflight_panel_v92"
```

Browser:

```javascript
typeof MultiBrokerAbstractionV92
typeof BrokerConnectionCenterV92
typeof BrokerPreflightPanelV92
MultiBrokerAbstractionV92.snapshot()
```
