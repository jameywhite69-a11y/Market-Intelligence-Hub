# Version 79.0 — Live Opportunity Engine

## 1. Copy files

```powershell
Copy-Item payload\app\static\js\scanner\live_opportunity_engine_v79.js app\static\js\scanner\live_opportunity_engine_v79.js -Force
Copy-Item payload\app\static\js\scanner\live_opportunity_tape_v79.js app\static\js\scanner\live_opportunity_tape_v79.js -Force
Copy-Item payload\app\static\js\scanner\live_opportunity_health_v79.js app\static\js\scanner\live_opportunity_health_v79.js -Force
Copy-Item payload\app\static\css\live_opportunity_engine_v79.css app\static\css\live_opportunity_engine_v79.css -Force
```

## 2. Add CSS to `base.html`

```html
<link rel="stylesheet" href="/static/css/live_opportunity_engine_v79.css">
```

## 3. Add placeholders to `_center_workspace.html`

Inside `.native-decision-grid`, near scanner/opportunity panels:

```html
<section id="liveOpportunityEnginePanelV79"></section>
<section id="liveOpportunityTapePanelV79"></section>
<section id="liveOpportunityHealthPanelV79"></section>
```

## 4. Add scripts to `_script_loader.html`

Add after V78 live data adapter scripts and before trade/execution engines:

```html
<script src="/static/js/scanner/live_opportunity_engine_v79.js"></script>
<script src="/static/js/scanner/live_opportunity_tape_v79.js"></script>
<script src="/static/js/scanner/live_opportunity_health_v79.js"></script>
```

## 5. Usage

Start the V74/V78 data bus, then V79 will convert quotes into live paper-trading opportunities.
