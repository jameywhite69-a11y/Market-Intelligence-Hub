# Version 55.0 — Institutional Trading Terminal

## 1. Copy files

```powershell
Copy-Item payload\app\static\js\ai\ai_trading_commander_terminal_v55.js app\static\js\ai\ai_trading_commander_terminal_v55.js -Force
Copy-Item payload\app\static\js\institutional\institutional_package_terminal_v55.js app\static\js\institutional\institutional_package_terminal_v55.js -Force
Copy-Item payload\app\static\js\scanner\opportunity_heatmap_terminal_v55.js app\static\js\scanner\opportunity_heatmap_terminal_v55.js -Force
Copy-Item payload\app\static\css\institutional_terminal_v55.css app\static\css\institutional_terminal_v55.css -Force
```

## 2. Add CSS to `base.html`

```html
<link rel="stylesheet" href="/static/css/institutional_terminal_v55.css">
```

## 3. Add placeholder to center workspace

In `_center_workspace.html`, near `institutionalDecisionPackagePanel`, add:

```html
<section id="institutionalPackageReportPanel"></section>
```

## 4. Add scripts to `_script_loader.html`

Add after the V54 AI / institutional scripts:

```html
<script src="/static/js/ai/ai_trading_commander_terminal_v55.js"></script>
<script src="/static/js/institutional/institutional_package_terminal_v55.js"></script>
<script src="/static/js/scanner/opportunity_heatmap_terminal_v55.js"></script>
```

## 5. Open

```text
http://127.0.0.1:8000/workstation_v54
```
