# Validation

```powershell
python -m compileall app
python -c "from app.main import app; print('App import OK')"
Select-String app\templates\base.html -Pattern "production_readiness_v95.css"
Select-String app\templates\workstation\_center_workspace.html -Pattern "productionReadinessGatePanelV95|emergencyStopPanelV95|deploymentReadinessPanelV95"
Select-String app\templates\workstation\_script_loader.html -Pattern "production_readiness_gate_v95|emergency_stop_panel_v95|deployment_readiness_panel_v95"
```

Browser:

```javascript
typeof ProductionReadinessGateV95
typeof EmergencyStopPanelV95
typeof DeploymentReadinessPanelV95
ProductionReadinessGateV95.readiness()
DeploymentReadinessPanelV95.checks()
```
