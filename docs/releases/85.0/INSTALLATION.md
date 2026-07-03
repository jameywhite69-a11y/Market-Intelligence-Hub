# Version 85.0 — Streaming Market Data Bus

## 1. Copy files

```powershell
Copy-Item payload\app\static\js\market\streaming_market_data_bus_v85.js app\static\js\market\streaming_market_data_bus_v85.js -Force
Copy-Item payload\app\static\js\market\candle_stream_panel_v85.js app\static\js\market\candle_stream_panel_v85.js -Force
Copy-Item payload\app\static\js\market\stream_health_panel_v85.js app\static\js\market\stream_health_panel_v85.js -Force
Copy-Item payload\app\static\css\streaming_market_data_v85.css app\static\css\streaming_market_data_v85.css -Force
```

## 2. Add CSS to `base.html`

```html
<link rel="stylesheet" href="/static/css/streaming_market_data_v85.css">
```

## 3. Add placeholders to `_center_workspace.html`

Inside `.native-decision-grid`, near V74/V78 market data panels:

```html
<section id="streamingMarketDataBusPanelV85"></section>
<section id="candleStreamPanelV85"></section>
<section id="streamHealthPanelV85"></section>
```

## 4. Add scripts to `_script_loader.html`

Add after V78 market data adapter scripts and before V79 live opportunity scripts:

```html
<script src="/static/js/market/streaming_market_data_bus_v85.js"></script>
<script src="/static/js/market/candle_stream_panel_v85.js"></script>
<script src="/static/js/market/stream_health_panel_v85.js"></script>
```
