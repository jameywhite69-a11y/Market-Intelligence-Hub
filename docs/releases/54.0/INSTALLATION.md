# Version 54.0 — AI Trading Commander

## 1. Copy files

```powershell
Copy-Item payload\app\static\js\ai\ai_trading_commander_panel.js app\static\js\ai\ai_trading_commander_panel.js -Force
Copy-Item payload\app\static\js\institutional\institutional_scorecard_panel_v54.js app\static\js\institutional\institutional_scorecard_panel_v54.js -Force
Copy-Item payload\app\static\js\institutional\compact_decision_pipeline_v54.js app\static\js\institutional\compact_decision_pipeline_v54.js -Force
Copy-Item payload\app\static\css\ai_trading_commander_v54.css app\static\css\ai_trading_commander_v54.css -Force
```

## 2. Add CSS to `base.html`

```html
<link rel="stylesheet" href="/static/css/ai_trading_commander_v54.css">
```

## 3. Add placeholders to `workstation_v53.html`

Inside the center decision area, preferably before or near `decisionPipelinePanel`, add:

```html
<section id="aiTradingCommanderPanel"></section>
<section id="institutionalScorecardPanel"></section>
<section id="compactDecisionPipelinePanel"></section>
```

## 4. Add scripts to `workstation_v53.html`

Add near the institutional / AI scripts:

```html
<script src="/static/js/ai/ai_trading_commander_panel.js"></script>
<script src="/static/js/institutional/institutional_scorecard_panel_v54.js"></script>
<script src="/static/js/institutional/compact_decision_pipeline_v54.js"></script>
```

## 5. Open

```text
http://127.0.0.1:8000/workstation_v53
```
