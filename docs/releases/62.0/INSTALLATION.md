# Version 62.0 — Institutional Market Context Engine

## 1. Copy files

```powershell
Copy-Item payload\app\static\js\market\institutional_market_context_engine_v62.js app\static\js\market\institutional_market_context_engine_v62.js -Force
Copy-Item payload\app\static\js\market\market_context_ai_bridge_v62.js app\static\js\market\market_context_ai_bridge_v62.js -Force
Copy-Item payload\app\static\js\market\market_context_dashboard_v62.js app\static\js\market\market_context_dashboard_v62.js -Force
Copy-Item payload\app\static\css\institutional_market_context_v62.css app\static\css\institutional_market_context_v62.css -Force
```

## 2. Add CSS to `base.html`

```html
<link rel="stylesheet" href="/static/css/institutional_market_context_v62.css">
```

## 3. Add placeholders to `_center_workspace.html`

Inside `.native-decision-grid`, preferably near the V61 market panels:

```html
<section id="institutionalMarketContextPanel"></section>
<section id="marketContextDashboardV62Panel"></section>
<section id="marketContextAIBridgePanel"></section>
```

## 4. Add scripts to `_script_loader.html`

Add after V61 market scripts:

```html
<script src="/static/js/market/institutional_market_context_engine_v62.js"></script>
<script src="/static/js/market/market_context_dashboard_v62.js"></script>
<script src="/static/js/market/market_context_ai_bridge_v62.js"></script>
```

## 5. Open

```text
http://127.0.0.1:8000/workstation_v54
```
