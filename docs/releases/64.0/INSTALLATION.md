# Version 64.0 — Institutional Portfolio Intelligence

## 1. Copy files

```powershell
Copy-Item payload\app\static\js\portfolio\portfolio_intelligence_store_v64.js app\static\js\portfolio\portfolio_intelligence_store_v64.js -Force
Copy-Item payload\app\static\js\portfolio\exposure_engine_v64.js app\static\js\portfolio\exposure_engine_v64.js -Force
Copy-Item payload\app\static\js\portfolio\correlation_engine_v64.js app\static\js\portfolio\correlation_engine_v64.js -Force
Copy-Item payload\app\static\js\risk\risk_budget_engine_v64.js app\static\js\risk\risk_budget_engine_v64.js -Force
Copy-Item payload\app\static\js\portfolio\portfolio_health_dashboard_v64.js app\static\js\portfolio\portfolio_health_dashboard_v64.js -Force
Copy-Item payload\app\static\css\institutional_portfolio_intelligence_v64.css app\static\css\institutional_portfolio_intelligence_v64.css -Force
```

## 2. Add CSS to `base.html`

```html
<link rel="stylesheet" href="/static/css/institutional_portfolio_intelligence_v64.css">
```

## 3. Add placeholders to `_center_workspace.html`

Inside `.native-decision-grid`, preferably near the V60 execution panels:

```html
<section id="portfolioHealthDashboardV64Panel"></section>
<section id="portfolioExposureEngineV64Panel"></section>
<section id="portfolioCorrelationEngineV64Panel"></section>
<section id="riskBudgetEngineV64Panel"></section>
```

## 4. Add scripts to `_script_loader.html`

Add after V63 context store scripts and before V59/V60 execution modules:

```html
<script src="/static/js/portfolio/portfolio_intelligence_store_v64.js"></script>
<script src="/static/js/portfolio/exposure_engine_v64.js"></script>
<script src="/static/js/portfolio/correlation_engine_v64.js"></script>
<script src="/static/js/risk/risk_budget_engine_v64.js"></script>
<script src="/static/js/portfolio/portfolio_health_dashboard_v64.js"></script>
```

## 5. Open

```text
http://127.0.0.1:8000/workstation_v54
```
