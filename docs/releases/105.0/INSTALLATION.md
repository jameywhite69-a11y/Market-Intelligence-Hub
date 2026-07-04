# Version 105.0 — Institutional Analytics Suite

```powershell
Copy-Item payload\app\static\js\analytics\institutional_analytics_engine_v105.js app\static\js\analytics\institutional_analytics_engine_v105.js -Force
Copy-Item payload\app\static\js\analytics\risk_adjusted_performance_panel_v105.js app\static\js\analytics\risk_adjusted_performance_panel_v105.js -Force
Copy-Item payload\app\static\js\analytics\trade_expectancy_panel_v105.js app\static\js\analytics\trade_expectancy_panel_v105.js -Force
Copy-Item payload\app\static\js\analytics\analytics_health_panel_v105.js app\static\js\analytics\analytics_health_panel_v105.js -Force
Copy-Item payload\app\static\css\institutional_analytics_v105.css app\static\css\institutional_analytics_v105.css -Force
```

Add CSS:

```html
<link rel="stylesheet" href="/static/css/institutional_analytics_v105.css">
```

Add placeholders:

```html
<section id="institutionalAnalyticsEnginePanelV105"></section>
<section id="riskAdjustedPerformancePanelV105"></section>
<section id="tradeExpectancyPanelV105"></section>
<section id="analyticsHealthPanelV105"></section>
```

Add scripts:

```html
<script src="/static/js/analytics/institutional_analytics_engine_v105.js"></script>
<script src="/static/js/analytics/risk_adjusted_performance_panel_v105.js"></script>
<script src="/static/js/analytics/trade_expectancy_panel_v105.js"></script>
<script src="/static/js/analytics/analytics_health_panel_v105.js"></script>
```
