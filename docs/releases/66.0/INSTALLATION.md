# Version 66.0 — Live Order Management Framework

## 1. Copy files

```powershell
Copy-Item payload\app\static\js\execution\live_order_manager_v66.js app\static\js\execution\live_order_manager_v66.js -Force
Copy-Item payload\app\static\js\execution\bracket_order_panel_v66.js app\static\js\execution\bracket_order_panel_v66.js -Force
Copy-Item payload\app\static\js\execution\order_monitor_v66.js app\static\js\execution\order_monitor_v66.js -Force
Copy-Item payload\app\static\css\live_order_management_v66.css app\static\css\live_order_management_v66.css -Force
```

## 2. Add CSS to `base.html`

```html
<link rel="stylesheet" href="/static/css/live_order_management_v66.css">
```

## 3. Add placeholders to `_center_workspace.html`

Inside `.native-decision-grid`, near V65 broker panels:

```html
<section id="liveOrderManagerPanelV66"></section>
<section id="bracketOrderPanelV66"></section>
<section id="orderMonitorPanelV66"></section>
```

## 4. Add scripts to `_script_loader.html`

Add after V65 broker scripts:

```html
<script src="/static/js/execution/live_order_manager_v66.js"></script>
<script src="/static/js/execution/bracket_order_panel_v66.js"></script>
<script src="/static/js/execution/order_monitor_v66.js"></script>
```

## 5. Open

```text
http://127.0.0.1:8000/workstation_v54
```
