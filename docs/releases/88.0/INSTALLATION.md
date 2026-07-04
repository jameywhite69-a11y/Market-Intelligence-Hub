# Version 88.0 — Professional Order Management System

## 1. Copy files

```powershell
Copy-Item payload\app\static\js\execution\order_management_system_v88.js app\static\js\execution\order_management_system_v88.js -Force
Copy-Item payload\app\static\js\execution\order_book_panel_v88.js app\static\js\execution\order_book_panel_v88.js -Force
Copy-Item payload\app\static\js\execution\execution_queue_panel_v88.js app\static\js\execution\execution_queue_panel_v88.js -Force
Copy-Item payload\app\static\js\execution\execution_audit_panel_v88.js app\static\js\execution\execution_audit_panel_v88.js -Force
Copy-Item payload\app\static\js\execution\oms_health_panel_v88.js app\static\js\execution\oms_health_panel_v88.js -Force
Copy-Item payload\app\static\css\professional_oms_v88.css app\static\css\professional_oms_v88.css -Force
```

## 2. Add CSS to `base.html`

```html
<link rel="stylesheet" href="/static/css/professional_oms_v88.css">
```

## 3. Add placeholders to `_center_workspace.html`

```html
<section id="orderManagementSystemPanelV88"></section>
<section id="orderBookPanelV88"></section>
<section id="executionQueuePanelV88"></section>
<section id="executionAuditPanelV88"></section>
<section id="omsHealthPanelV88"></section>
```

## 4. Add scripts to `_script_loader.html`

```html
<script src="/static/js/execution/order_management_system_v88.js"></script>
<script src="/static/js/execution/order_book_panel_v88.js"></script>
<script src="/static/js/execution/execution_queue_panel_v88.js"></script>
<script src="/static/js/execution/execution_audit_panel_v88.js"></script>
<script src="/static/js/execution/oms_health_panel_v88.js"></script>
```
