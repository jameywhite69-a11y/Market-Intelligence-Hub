# Validation

```powershell
python -m compileall app
python -c "from app.main import app; print('App import OK')"
Select-String app\templates\base.html -Pattern "execution_workflow_v60.css"
Select-String app\templates\workstation\_center_workspace.html -Pattern "executionWorkflowEnginePanel|capitalAllocationEnginePanel|executionConsoleV60Panel"
Select-String app\templates\workstation\_script_loader.html -Pattern "execution_workflow_engine_v60|capital_allocation_engine_v60|execution_console_v60"
```

Browser console:

```javascript
typeof ExecutionWorkflowEngineV60
typeof ExecutionConsoleV60
typeof CapitalAllocationEngineV60
ExecutionWorkflowEngineV60.get()
```
