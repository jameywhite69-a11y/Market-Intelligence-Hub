# Version 61.0 — Market Intelligence Core

## 1. Copy files

```powershell
Copy-Item payload\app\static\js\market\market_regime_engine_v61.js app\static\js\market\market_regime_engine_v61.js -Force
Copy-Item payload\app\static\js\market\relative_strength_rankings_v61.js app\static\js\market\relative_strength_rankings_v61.js -Force
Copy-Item payload\app\static\js\market\market_breadth_panel_v61.js app\static\js\market\market_breadth_panel_v61.js -Force
Copy-Item payload\app\static\js\market\institutional_flow_panel_v61.js app\static\js\market\institutional_flow_panel_v61.js -Force
Copy-Item payload\app\static\css\market_intelligence_core_v61.css app\static\css\market_intelligence_core_v61.css -Force
```

## 2. Add CSS to `base.html`

```html
<link rel="stylesheet" href="/static/css/market_intelligence_core_v61.css">
```

## 3. Add placeholders to `_center_workspace.html`

Inside `.native-decision-grid`, preferably near the top before trade execution panels:

```html
<section id="marketRegimeEnginePanel"></section>
<section id="relativeStrengthRankingsPanel"></section>
<section id="marketBreadthPanelV61"></section>
<section id="institutionalFlowPanelV61"></section>
```

## 4. Add scripts to `_script_loader.html`

Add after scanner engine scripts and before decision/trade engines:

```html
<script src="/static/js/market/market_regime_engine_v61.js"></script>
<script src="/static/js/market/relative_strength_rankings_v61.js"></script>
<script src="/static/js/market/market_breadth_panel_v61.js"></script>
<script src="/static/js/market/institutional_flow_panel_v61.js"></script>
```

## 5. Open

```text
http://127.0.0.1:8000/workstation_v54
```
