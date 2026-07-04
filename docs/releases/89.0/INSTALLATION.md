# Version 89.0 — Institutional Integration Layer

## 1. Copy files

```powershell
Copy-Item payload\app\static\js\system\institutional_integration_bus_v89.js app\static\js\system\institutional_integration_bus_v89.js -Force
Copy-Item payload\app\static\js\system\workflow_synchronizer_v89.js app\static\js\system\workflow_synchronizer_v89.js -Force
Copy-Item payload\app\static\js\system\integration_health_panel_v89.js app\static\js\system\integration_health_panel_v89.js -Force
Copy-Item payload\app\static\css\institutional_integration_v89.css app\static\css\institutional_integration_v89.css -Force
```

## 2. Add CSS to `base.html`

```html
<link rel="stylesheet" href="/static/css/institutional_integration_v89.css">
```

## 3. Add placeholders to `_center_workspace.html`

Inside `.native-decision-grid`, near platform health or after V88 OMS:

```html
<section id="institutionalIntegrationBusPanelV89"></section>
<section id="integrationHealthPanelV89"></section>
```

## 4. Add scripts to `_script_loader.html`

Add after V88 OMS and after V80-V84/V82 dependencies are loaded, near final system integrations:

```html
<script src="/static/js/system/institutional_integration_bus_v89.js"></script>
<script src="/static/js/system/workflow_synchronizer_v89.js"></script>
<script src="/static/js/system/integration_health_panel_v89.js"></script>
```
