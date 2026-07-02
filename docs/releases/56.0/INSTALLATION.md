# Version 56.0 — Institutional Scanner Engine

## 1. Copy files

```powershell
Copy-Item payload\app\static\js\scanner\institutional_scanner_engine_v56.js app\static\js\scanner\institutional_scanner_engine_v56.js -Force
Copy-Item payload\app\static\css\institutional_scanner_v56.css app\static\css\institutional_scanner_v56.css -Force
```

## 2. Add CSS to `base.html`

```html
<link rel="stylesheet" href="/static/css/institutional_scanner_v56.css">
```

## 3. Add placeholders to `_center_workspace.html`

Near the top opportunity dashboard or decision grid:

```html
<section id="institutionalWatchlistPanel"></section>
<section id="institutionalHeatmapV56Panel"></section>
<section id="executionReadinessPanel"></section>
```

## 4. Add script to `_script_loader.html`

Add near scanner modules, preferably after `scanner_orchestrator.js`:

```html
<script src="/static/js/scanner/institutional_scanner_engine_v56.js"></script>
```

## 5. Open

```text
http://127.0.0.1:8000/workstation_v54
```
