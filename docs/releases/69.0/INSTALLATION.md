# Version 69.0 — Institutional Workflow Automation Engine

## 1. Copy files

```powershell
Copy-Item payload\app\static\js\automation\workflow_automation_engine_v69.js app\static\js\automation\workflow_automation_engine_v69.js -Force
Copy-Item payload\app\static\js\automation\automation_event_log_v69.js app\static\js\automation\automation_event_log_v69.js -Force
Copy-Item payload\app\static\js\automation\alert_rule_builder_v69.js app\static\js\automation\alert_rule_builder_v69.js -Force
Copy-Item payload\app\static\css\workflow_automation_v69.css app\static\css\workflow_automation_v69.css -Force
```

## 2. Add CSS to `base.html`

```html
<link rel="stylesheet" href="/static/css/workflow_automation_v69.css">
```

## 3. Add placeholders to `_center_workspace.html`

Inside `.native-decision-grid`, preferably near execution/order panels:

```html
<section id="workflowAutomationEnginePanelV69"></section>
<section id="alertRuleBuilderPanelV69"></section>
<section id="automationEventLogPanelV69"></section>
```

## 4. Add scripts to `_script_loader.html`

Add after V68 AI trade review scripts, or near the existing automation scripts:

```html
<script src="/static/js/automation/workflow_automation_engine_v69.js"></script>
<script src="/static/js/automation/alert_rule_builder_v69.js"></script>
<script src="/static/js/automation/automation_event_log_v69.js"></script>
```

## 5. Open

```text
http://127.0.0.1:8000/workstation_v54
```
