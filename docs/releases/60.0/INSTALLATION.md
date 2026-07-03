# Version 60.0 — Execution Workflow Engine

## 1. Copy files

```powershell
Copy-Item payload\app\static\js\execution\execution_workflow_engine_v60.js app\static\js\execution\execution_workflow_engine_v60.js -Force
Copy-Item payload\app\static\js\execution\execution_console_v60.js app\static\js\execution\execution_console_v60.js -Force
Copy-Item payload\app\static\js\risk\capital_allocation_engine_v60.js app\static\js\risk\capital_allocation_engine_v60.js -Force
Copy-Item payload\app\static\css\execution_workflow_v60.css app\static\css\execution_workflow_v60.css -Force
```

## 2. Add CSS to `base.html`

```html
<link rel="stylesheet" href="/static/css/execution_workflow_v60.css">
```

## 3. Add placeholders to `_center_workspace.html`

Inside `.native-decision-grid`, preferably after Version 59 panels:

```html
<section id="executionWorkflowEnginePanel"></section>
<section id="capitalAllocationEnginePanel"></section>
<section id="executionConsoleV60Panel"></section>
```

## 4. Add scripts to `_script_loader.html`

Add after the V59 trade engine scripts:

```html
<script src="/static/js/execution/execution_workflow_engine_v60.js"></script>
<script src="/static/js/risk/capital_allocation_engine_v60.js"></script>
<script src="/static/js/execution/execution_console_v60.js"></script>
```

## 5. Open

```text
http://127.0.0.1:8000/workstation_v54
```
