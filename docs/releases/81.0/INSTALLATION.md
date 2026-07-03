# Version 81.0 — Position & Risk Manager

## 1. Copy files

```powershell
Copy-Item payload\app\static\js\paper\position_risk_manager_v81.js app\static\js\paper\position_risk_manager_v81.js -Force
Copy-Item payload\app\static\js\paper\position_lifecycle_dashboard_v81.js app\static\js\paper\position_lifecycle_dashboard_v81.js -Force
Copy-Item payload\app\static\js\paper\stop_target_manager_v81.js app\static\js\paper\stop_target_manager_v81.js -Force
Copy-Item payload\app\static\css\position_risk_manager_v81.css app\static\css\position_risk_manager_v81.css -Force
```

## 2. Add CSS to `base.html`

```html
<link rel="stylesheet" href="/static/css/position_risk_manager_v81.css">
```

## 3. Add placeholders to `_center_workspace.html`

Inside `.native-decision-grid`, after the V80 paper trading panels:

```html
<section id="positionRiskManagerPanelV81"></section>
<section id="positionLifecycleDashboardV81"></section>
<section id="stopTargetManagerPanelV81"></section>
```

## 4. Add scripts to `_script_loader.html`

Add after V80 paper trading scripts:

```html
<script src="/static/js/paper/position_risk_manager_v81.js"></script>
<script src="/static/js/paper/position_lifecycle_dashboard_v81.js"></script>
<script src="/static/js/paper/stop_target_manager_v81.js"></script>
```
