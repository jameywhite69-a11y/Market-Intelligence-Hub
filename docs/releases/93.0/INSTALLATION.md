# Version 93.0 — Portfolio Analytics & Attribution

## 1. Copy files

```powershell
Copy-Item payload\app\static\js\analytics\portfolio_attribution_engine_v93.js app\static\js\analytics\portfolio_attribution_engine_v93.js -Force
Copy-Item payload\app\static\js\analytics\exposure_attribution_panel_v93.js app\static\js\analytics\exposure_attribution_panel_v93.js -Force
Copy-Item payload\app\static\js\analytics\performance_attribution_panel_v93.js app\static\js\analytics\performance_attribution_panel_v93.js -Force
Copy-Item payload\app\static\js\analytics\execution_attribution_panel_v93.js app\static\js\analytics\execution_attribution_panel_v93.js -Force
Copy-Item payload\app\static\css\portfolio_analytics_v93.css app\static\css\portfolio_analytics_v93.css -Force
```

## 2. Add CSS to `base.html`

```html
<link rel="stylesheet" href="/static/css/portfolio_analytics_v93.css">
```

## 3. Add placeholders to `_center_workspace.html`

```html
<section id="portfolioAttributionEnginePanelV93"></section>
<section id="exposureAttributionPanelV93"></section>
<section id="performanceAttributionPanelV93"></section>
<section id="executionAttributionPanelV93"></section>
```

## 4. Add scripts to `_script_loader.html`

Add after V91 execution simulation and before/near V89 integration:

```html
<script src="/static/js/analytics/portfolio_attribution_engine_v93.js"></script>
<script src="/static/js/analytics/exposure_attribution_panel_v93.js"></script>
<script src="/static/js/analytics/performance_attribution_panel_v93.js"></script>
<script src="/static/js/analytics/execution_attribution_panel_v93.js"></script>
```
