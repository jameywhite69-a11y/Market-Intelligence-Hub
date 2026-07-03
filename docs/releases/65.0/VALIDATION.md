# Validation

```powershell
python -m compileall app
python -c "from app.main import app; print('App import OK')"
Select-String app\templates\base.html -Pattern "broker_abstraction_v65.css"
Select-String app\templates\workstation\_center_workspace.html -Pattern "executionServicePanelV65|brokerAdapterRegistryPanelV65|orderLifecyclePanelV65"
Select-String app\templates\workstation\_script_loader.html -Pattern "execution_service_v65|broker_adapter_registry_v65|order_lifecycle_panel_v65"
```

Browser console:

```javascript
typeof ExecutionServiceV65
typeof BrokerAdapterRegistryV65
typeof OrderLifecyclePanelV65
ExecutionServiceV65.snapshot()
```
