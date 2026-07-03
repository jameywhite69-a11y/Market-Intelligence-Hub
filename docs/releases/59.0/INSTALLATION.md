# Version 59.0 — Institutional Trade Engine

## 1. Copy files

```powershell
Copy-Item payload\app\static\js\trading\institutional_trade_engine_v59.js app\static\js\trading\institutional_trade_engine_v59.js -Force
Copy-Item payload\app\static\js\trading\institutional_decision_queue_v59.js app\static\js\trading\institutional_decision_queue_v59.js -Force
Copy-Item payload\app\static\js\risk\portfolio_exposure_engine_v59.js app\static\js\risk\portfolio_exposure_engine_v59.js -Force
Copy-Item payload\app\static\css\institutional_trade_engine_v59.css app\static\css\institutional_trade_engine_v59.css -Force
```

## 2. Add CSS to `base.html`

```html
<link rel="stylesheet" href="/static/css/institutional_trade_engine_v59.css">
```

## 3. Add placeholders to `_center_workspace.html`

Inside `.native-decision-grid`, preferably after the AI Commander and Scorecard:

```html
<section id="institutionalTradeEnginePanel"></section>
<section id="institutionalDecisionQueuePanel"></section>
<section id="portfolioExposureEnginePanel"></section>
```

## 4. Add scripts to `_script_loader.html`

Add after the V57/V58 decision and risk modules:

```html
<script src="/static/js/trading/institutional_trade_engine_v59.js"></script>
<script src="/static/js/trading/institutional_decision_queue_v59.js"></script>
<script src="/static/js/risk/portfolio_exposure_engine_v59.js"></script>
```

## 5. Open

```text
http://127.0.0.1:8000/workstation_v54
```
