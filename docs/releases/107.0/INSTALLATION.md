# Version 107.0 — Institutional Alert Center

```powershell
Copy-Item payload\app\static\js\alerts\institutional_alert_center_v107.js app\static\js\alerts\institutional_alert_center_v107.js -Force
Copy-Item payload\app\static\js\alerts\alert_rule_manager_v107.js app\static\js\alerts\alert_rule_manager_v107.js -Force
Copy-Item payload\app\static\js\alerts\alert_delivery_log_v107.js app\static\js\alerts\alert_delivery_log_v107.js -Force
Copy-Item payload\app\static\js\alerts\alert_health_panel_v107.js app\static\js\alerts\alert_health_panel_v107.js -Force
Copy-Item payload\app\static\css\institutional_alert_center_v107.css app\static\css\institutional_alert_center_v107.css -Force
```

Add CSS:

```html
<link rel="stylesheet" href="/static/css/institutional_alert_center_v107.css">
```

Add placeholders:

```html
<section id="institutionalAlertCenterPanelV107"></section>
<section id="alertRuleManagerPanelV107"></section>
<section id="alertDeliveryLogPanelV107"></section>
<section id="alertHealthPanelV107"></section>
```

Add scripts:

```html
<script src="/static/js/alerts/institutional_alert_center_v107.js"></script>
<script src="/static/js/alerts/alert_rule_manager_v107.js"></script>
<script src="/static/js/alerts/alert_delivery_log_v107.js"></script>
<script src="/static/js/alerts/alert_health_panel_v107.js"></script>
```
