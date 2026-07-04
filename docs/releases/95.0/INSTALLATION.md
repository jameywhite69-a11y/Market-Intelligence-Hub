# Version 95.0 — Production Readiness & Live Enablement Gate

```powershell
Copy-Item payload\app\static\js\system\production_readiness_gate_v95.js app\static\js\system\production_readiness_gate_v95.js -Force
Copy-Item payload\app\static\js\system\emergency_stop_panel_v95.js app\static\js\system\emergency_stop_panel_v95.js -Force
Copy-Item payload\app\static\js\system\deployment_readiness_panel_v95.js app\static\js\system\deployment_readiness_panel_v95.js -Force
Copy-Item payload\app\static\css\production_readiness_v95.css app\static\css\production_readiness_v95.css -Force
```

Add CSS:

```html
<link rel="stylesheet" href="/static/css/production_readiness_v95.css">
```

Add placeholders:

```html
<section id="productionReadinessGatePanelV95"></section>
<section id="emergencyStopPanelV95"></section>
<section id="deploymentReadinessPanelV95"></section>
```

Add scripts near final system integrations:

```html
<script src="/static/js/system/production_readiness_gate_v95.js"></script>
<script src="/static/js/system/emergency_stop_panel_v95.js"></script>
<script src="/static/js/system/deployment_readiness_panel_v95.js"></script>
```
