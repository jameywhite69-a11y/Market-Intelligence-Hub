# Version 57.0 — Unified Institutional Decision Engine

## 1. Copy files

```powershell
Copy-Item payload\app\static\js\decision\unified_decision_engine_v57.js app\static\js\decision\unified_decision_engine_v57.js -Force
Copy-Item payload\app\static\js\decision\opportunity_timeline_v57.js app\static\js\decision\opportunity_timeline_v57.js -Force
Copy-Item payload\app\static\js\risk\position_size_calculator_v57.js app\static\js\risk\position_size_calculator_v57.js -Force
Copy-Item payload\app\static\css\unified_decision_engine_v57.css app\static\css\unified_decision_engine_v57.css -Force
```

## 2. Add CSS to `base.html`

```html
<link rel="stylesheet" href="/static/css/unified_decision_engine_v57.css">
```

## 3. Add placeholders to `_center_workspace.html`

Inside `.native-decision-grid`, preferably near the top:

```html
<section id="unifiedDecisionEnginePanel"></section>
<section id="positionSizeCalculatorPanel"></section>
<section id="opportunityTimelineV57Panel"></section>
```

## 4. Add scripts to `_script_loader.html`

Add after decision engine scripts and before AI Commander scripts:

```html
<script src="/static/js/decision/unified_decision_engine_v57.js"></script>
<script src="/static/js/risk/position_size_calculator_v57.js"></script>
<script src="/static/js/decision/opportunity_timeline_v57.js"></script>
```

## 5. Open

```text
http://127.0.0.1:8000/workstation_v54
```
