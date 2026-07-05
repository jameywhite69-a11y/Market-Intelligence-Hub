# Version 108.0 — Production Broker Integration Framework

```powershell
Copy-Item payload\app\static\js\broker\production_broker_gateway_v108.js app\static\js\broker\production_broker_gateway_v108.js -Force
Copy-Item payload\app\static\js\broker\broker_connection_wizard_v108.js app\static\js\broker\broker_connection_wizard_v108.js -Force
Copy-Item payload\app\static\js\broker\broker_gateway_health_v108.js app\static\js\broker\broker_gateway_health_v108.js -Force
Copy-Item payload\app\static\css\production_broker_gateway_v108.css app\static\css\production_broker_gateway_v108.css -Force
```

Add CSS:

```html
<link rel="stylesheet" href="/static/css/production_broker_gateway_v108.css">
```

Add placeholders:

```html
<section id="productionBrokerGatewayPanelV108"></section>
<section id="brokerConnectionWizardPanelV108"></section>
<section id="brokerGatewayHealthPanelV108"></section>
```

Add scripts:

```html
<script src="/static/js/broker/production_broker_gateway_v108.js"></script>
<script src="/static/js/broker/broker_connection_wizard_v108.js"></script>
<script src="/static/js/broker/broker_gateway_health_v108.js"></script>
```
