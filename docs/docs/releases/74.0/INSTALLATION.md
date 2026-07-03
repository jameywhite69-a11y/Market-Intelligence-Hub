# Version 74.0 — Real-Time Data Synchronization

## 1. Copy files

```powershell
Copy-Item payload\app\static\js\market\realtime_data_bus_v74.js app\static\js\market\realtime_data_bus_v74.js -Force
Copy-Item payload\app\static\js\market\realtime_quote_tape_v74.js app\static\js\market\realtime_quote_tape_v74.js -Force
Copy-Item payload\app\static\js\market\data_sync_health_panel_v74.js app\static\js\market\data_sync_health_panel_v74.js -Force
Copy-Item payload\app\static\css\realtime_data_sync_v74.css app\static\css\realtime_data_sync_v74.css -Force
```

## 2. Add CSS to `base.html`

```html
<link rel="stylesheet" href="/static/css/realtime_data_sync_v74.css">
```

## 3. Add placeholders to `_center_workspace.html`

Inside `.native-decision-grid`:

```html
<section id="realtimeDataBusPanelV74"></section>
<section id="realtimeQuoteTapePanelV74"></section>
<section id="dataSyncHealthPanelV74"></section>
```

## 4. Add scripts to `_script_loader.html`

Add near market data scripts, after live market data client/panel:

```html
<script src="/static/js/market/realtime_data_bus_v74.js"></script>
<script src="/static/js/market/realtime_quote_tape_v74.js"></script>
<script src="/static/js/market/data_sync_health_panel_v74.js"></script>
```
