# Version 65.0 — Broker Abstraction Layer

## 1. Copy files

```powershell
Copy-Item payload\app\static\js\broker\execution_service_v65.js app\static\js\broker\execution_service_v65.js -Force
Copy-Item payload\app\static\js\broker\broker_adapter_registry_v65.js app\static\js\broker\broker_adapter_registry_v65.js -Force
Copy-Item payload\app\static\js\broker\order_lifecycle_panel_v65.js app\static\js\broker\order_lifecycle_panel_v65.js -Force
Copy-Item payload\app\static\css\broker_abstraction_v65.css app\static\css\broker_abstraction_v65.css -Force
```

## 2. Add CSS to `base.html`

```html
<link rel="stylesheet" href="/static/css/broker_abstraction_v65.css">
```

## 3. Add placeholders to `_center_workspace.html`

Inside `.native-decision-grid`, preferably near the V60 execution panels:

```html
<section id="executionServicePanelV65"></section>
<section id="brokerAdapterRegistryPanelV65"></section>
<section id="orderLifecyclePanelV65"></section>
```

## 4. Add scripts to `_script_loader.html`

Add after V60 execution workflow scripts:

```html
<script src="/static/js/broker/execution_service_v65.js"></script>
<script src="/static/js/broker/broker_adapter_registry_v65.js"></script>
<script src="/static/js/broker/order_lifecycle_panel_v65.js"></script>
```

## 5. Open

```text
http://127.0.0.1:8000/workstation_v54
```
