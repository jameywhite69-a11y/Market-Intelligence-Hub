# Version 71.0 — Production Polish

## 1. Copy files

```powershell
Copy-Item payload\app\static\js\system\production_polish_controller_v71.js app\static\js\system\production_polish_controller_v71.js -Force
Copy-Item payload\app\static\js\system\runtime_health_monitor_v71.js app\static\js\system\runtime_health_monitor_v71.js -Force
Copy-Item payload\app\static\css\production_polish_v71.css app\static\css\production_polish_v71.css -Force
```

## 2. Add CSS to `base.html`

```html
<link rel="stylesheet" href="/static/css/production_polish_v71.css">
```

## 3. Add placeholders to `_center_workspace.html`

Inside `.native-decision-grid`:

```html
<section id="productionPolishPanelV71"></section>
<section id="runtimeHealthMonitorPanelV71"></section>
```

## 4. Add scripts to `_script_loader.html`

Add near the final system scripts:

```html
<script src="/static/js/system/production_polish_controller_v71.js"></script>
<script src="/static/js/system/runtime_health_monitor_v71.js"></script>
```
