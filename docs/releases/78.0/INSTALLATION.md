# Version 78.0 — Live Data Adapter Framework

## 1. Copy files

```powershell
Copy-Item payload\app\static\js\market\market_data_adapter_registry_v78.js app\static\js\market\market_data_adapter_registry_v78.js -Force
Copy-Item payload\app\static\js\market\realtime_data_bus_adapter_bridge_v78.js app\static\js\market\realtime_data_bus_adapter_bridge_v78.js -Force
Copy-Item payload\app\static\js\market\data_provider_health_panel_v78.js app\static\js\market\data_provider_health_panel_v78.js -Force
Copy-Item payload\app\static\css\live_data_adapter_v78.css app\static\css\live_data_adapter_v78.css -Force
```

## 2. Add CSS to `base.html`

```html
<link rel="stylesheet" href="/static/css/live_data_adapter_v78.css">
```

## 3. Add placeholders to `_center_workspace.html`

Inside `.native-decision-grid` near V74 realtime data panels:

```html
<section id="marketDataAdapterRegistryPanelV78"></section>
<section id="realtimeAdapterBridgePanelV78"></section>
<section id="dataProviderHealthPanelV78"></section>
```

## 4. Add scripts to `_script_loader.html`

Add after V74 realtime data scripts:

```html
<script src="/static/js/market/market_data_adapter_registry_v78.js"></script>
<script src="/static/js/market/realtime_data_bus_adapter_bridge_v78.js"></script>
<script src="/static/js/market/data_provider_health_panel_v78.js"></script>
```

## 5. What this does

- Adds provider-neutral adapter registry.
- Keeps demo-safe adapter as default.
- Adds internal API adapter if `/api/market-data/quote/{symbol}` works.
- Adds placeholders for Coinbase, Alpaca, TradeStation provider configuration.
