# Version 91.0 — Live Execution Simulation Engine

## 1. Copy files

```powershell
Copy-Item payload\app\static\js\execution\execution_simulator_v91.js app\static\js\execution\execution_simulator_v91.js -Force
Copy-Item payload\app\static\js\execution\simulated_fills_panel_v91.js app\static\js\execution\simulated_fills_panel_v91.js -Force
Copy-Item payload\app\static\js\execution\execution_quality_panel_v91.js app\static\js\execution\execution_quality_panel_v91.js -Force
Copy-Item payload\app\static\js\execution\execution_sim_health_v91.js app\static\js\execution\execution_sim_health_v91.js -Force
Copy-Item payload\app\static\css\execution_simulator_v91.css app\static\css\execution_simulator_v91.css -Force
```

## 2. Add CSS to `base.html`

```html
<link rel="stylesheet" href="/static/css/execution_simulator_v91.css">
```

## 3. Add placeholders to `_center_workspace.html`

```html
<section id="executionSimulatorPanelV91"></section>
<section id="simulatedFillsPanelV91"></section>
<section id="executionQualityPanelV91"></section>
<section id="executionSimHealthPanelV91"></section>
```

## 4. Add scripts to `_script_loader.html`

Add after V88 OMS and V90 broker guard:

```html
<script src="/static/js/execution/execution_simulator_v91.js"></script>
<script src="/static/js/execution/simulated_fills_panel_v91.js"></script>
<script src="/static/js/execution/execution_quality_panel_v91.js"></script>
<script src="/static/js/execution/execution_sim_health_v91.js"></script>
```
