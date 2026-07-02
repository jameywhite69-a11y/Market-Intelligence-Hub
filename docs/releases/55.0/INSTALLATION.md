# Version 55.0 — Production Workspace Mode

## 1. Copy files

```powershell
Copy-Item payload\app\static\js\workstation\developer_mode_controller_v55.js app\static\js\workstation\developer_mode_controller_v55.js -Force
Copy-Item payload\app\static\js\ai\trade_execution_planner_v55.js app\static\js\ai\trade_execution_planner_v55.js -Force
Copy-Item payload\app\static\js\risk\risk_matrix_panel_v55.js app\static\js\risk\risk_matrix_panel_v55.js -Force
Copy-Item payload\app\static\css\production_workspace_v55.css app\static\css\production_workspace_v55.css -Force
```

## 2. Add CSS to `base.html`

```html
<link rel="stylesheet" href="/static/css/production_workspace_v55.css">
```

## 3. Add placeholders to `workstation_v53.html`

Inside the center workspace, preferably below `aiTradingCommanderPanel` / decision panels:

```html
<section id="tradeExecutionPlannerPanel"></section>
<section id="riskMatrixPanel"></section>
```

## 4. Add scripts to `workstation_v53.html`

Add near the bottom:

```html
<script src="/static/js/ai/trade_execution_planner_v55.js"></script>
<script src="/static/js/risk/risk_matrix_panel_v55.js"></script>
<script src="/static/js/workstation/developer_mode_controller_v55.js"></script>
```

## 5. Open

```text
http://127.0.0.1:8000/workstation_v53
```
