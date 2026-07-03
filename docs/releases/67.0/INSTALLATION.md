# Version 67.0 — Portfolio Performance Analytics

## 1. Copy files

```powershell
New-Item -ItemType Directory -Force app\static\js\analytics
Copy-Item payload\app\static\js\analytics\performance_analytics_engine_v67.js app\static\js\analytics\performance_analytics_engine_v67.js -Force
Copy-Item payload\app\static\js\analytics\performance_dashboard_v67.js app\static\js\analytics\performance_dashboard_v67.js -Force
Copy-Item payload\app\static\js\analytics\strategy_ranking_panel_v67.js app\static\js\analytics\strategy_ranking_panel_v67.js -Force
Copy-Item payload\app\static\js\analytics\equity_curve_panel_v67.js app\static\js\analytics\equity_curve_panel_v67.js -Force
Copy-Item payload\app\static\css\portfolio_performance_analytics_v67.css app\static\css\portfolio_performance_analytics_v67.css -Force
```

## 2. Add CSS to `base.html`

```html
<link rel="stylesheet" href="/static/css/portfolio_performance_analytics_v67.css">
```

## 3. Add placeholders to `_center_workspace.html`

Inside `.native-decision-grid`, near the portfolio/execution panels:

```html
<section id="performanceDashboardV67Panel"></section>
<section id="equityCurvePanelV67"></section>
<section id="strategyRankingPanelV67"></section>
```

## 4. Add scripts to `_script_loader.html`

Add after V66 live order management scripts:

```html
<script src="/static/js/analytics/performance_analytics_engine_v67.js"></script>
<script src="/static/js/analytics/performance_dashboard_v67.js"></script>
<script src="/static/js/analytics/equity_curve_panel_v67.js"></script>
<script src="/static/js/analytics/strategy_ranking_panel_v67.js"></script>
```

## 5. Open

```text
http://127.0.0.1:8000/workstation_v54
```
