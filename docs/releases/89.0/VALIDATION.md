# Validation

```powershell
python -m compileall app
python -c "from app.main import app; print('App import OK')"
Select-String app\templates\base.html -Pattern "institutional_integration_v89.css"
Select-String app\templates\workstation\_center_workspace.html -Pattern "institutionalIntegrationBusPanelV89|integrationHealthPanelV89"
Select-String app\templates\workstation\_script_loader.html -Pattern "institutional_integration_bus_v89|workflow_synchronizer_v89|integration_health_panel_v89"
```

Browser console:

```javascript
typeof InstitutionalIntegrationBusV89
typeof WorkflowSynchronizerV89
typeof IntegrationHealthPanelV89
InstitutionalIntegrationBusV89.publish("manual")
InstitutionalIntegrationBusV89.snapshot()
```
