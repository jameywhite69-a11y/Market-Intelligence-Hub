# Version 87.0 — Institutional Chart Workspace

## 1. Copy files

```powershell
New-Item -ItemType Directory -Force app\static\js\charts
Copy-Item payload\app\static\js\charts\institutional_chart_workspace_v87.js app\static\js\charts\institutional_chart_workspace_v87.js -Force
Copy-Item payload\app\static\js\charts\chart_overlay_engine_v87.js app\static\js\charts\chart_overlay_engine_v87.js -Force
Copy-Item payload\app\static\js\charts\chart_workspace_health_v87.js app\static\js\charts\chart_workspace_health_v87.js -Force
Copy-Item payload\app\static\css\institutional_chart_workspace_v87.css app\static\css\institutional_chart_workspace_v87.css -Force
```

## 2. Add CSS to `base.html`

```html
<link rel="stylesheet" href="/static/css/institutional_chart_workspace_v87.css">
```

## 3. Add placeholders to `_center_workspace.html`

```html
<section id="institutionalChartWorkspacePanelV87"></section>
<section id="chartOverlayEnginePanelV87"></section>
<section id="chartWorkspaceHealthPanelV87"></section>
```

## 4. Add scripts to `_script_loader.html`

```html
<script src="/static/js/charts/institutional_chart_workspace_v87.js"></script>
<script src="/static/js/charts/chart_overlay_engine_v87.js"></script>
<script src="/static/js/charts/chart_workspace_health_v87.js"></script>
```
