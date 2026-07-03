# Validation

```powershell
python -m compileall app
python -c "from app.main import app; print('App import OK')"
Select-String app\templates\base.html -Pattern "workflow_automation_v69.css"
Select-String app\templates\workstation\_center_workspace.html -Pattern "workflowAutomationEnginePanelV69|alertRuleBuilderPanelV69|automationEventLogPanelV69"
Select-String app\templates\workstation\_script_loader.html -Pattern "workflow_automation_engine_v69|alert_rule_builder_v69|automation_event_log_v69"
```

Browser console:

```javascript
typeof WorkflowAutomationEngineV69
typeof AlertRuleBuilderV69
typeof AutomationEventLogV69
WorkflowAutomationEngineV69.snapshot()
```
