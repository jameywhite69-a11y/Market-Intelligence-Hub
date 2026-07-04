# Validation

```powershell
python -m compileall app
python -c "from app.main import app; print('App import OK')"
Select-String app\templates\base.html -Pattern "execution_simulator_v91.css"
Select-String app\templates\workstation\_center_workspace.html -Pattern "executionSimulatorPanelV91|simulatedFillsPanelV91|executionQualityPanelV91|executionSimHealthPanelV91"
Select-String app\templates\workstation\_script_loader.html -Pattern "execution_simulator_v91|simulated_fills_panel_v91|execution_quality_panel_v91|execution_sim_health_v91"
```

Browser:

```javascript
typeof ExecutionSimulatorV91
typeof SimulatedFillsPanelV91
typeof ExecutionQualityPanelV91
typeof ExecutionSimHealthPanelV91
ExecutionSimulatorV91.simulate()
ExecutionSimulatorV91.snapshot()
```
