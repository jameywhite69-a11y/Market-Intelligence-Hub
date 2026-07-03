# Version 63.0 — Context Store Architecture

## 1. Copy files

```powershell
Copy-Item payload\app\static\js\core\market_context_store_v63.js app\static\js\core\market_context_store_v63.js -Force
Copy-Item payload\app\static\js\core\selection_coordinator_v63.js app\static\js\core\selection_coordinator_v63.js -Force
Copy-Item payload\app\static\js\core\workspace_render_scheduler_v63.js app\static\js\core\workspace_render_scheduler_v63.js -Force
Copy-Item payload\app\static\js\workstation\context_overview_panel_v63.js app\static\js\workstation\context_overview_panel_v63.js -Force
Copy-Item payload\app\static\css\context_store_architecture_v63.css app\static\css\context_store_architecture_v63.css -Force
```

## 2. Add CSS to `base.html`

```html
<link rel="stylesheet" href="/static/css/context_store_architecture_v63.css">
```

## 3. Add placeholder to `_center_workspace.html`

Inside `.native-decision-grid`, preferably near the top:

```html
<section id="contextOverviewPanelV63"></section>
```

## 4. Add scripts to `_script_loader.html`

Add after V58 Event State Engine and before scanner/market modules:

```html
<script src="/static/js/core/market_context_store_v63.js"></script>
<script src="/static/js/core/selection_coordinator_v63.js"></script>
<script src="/static/js/core/workspace_render_scheduler_v63.js"></script>
```

Add near workstation panels:

```html
<script src="/static/js/workstation/context_overview_panel_v63.js"></script>
```

## 5. Open

```text
http://127.0.0.1:8000/workstation_v54
```
