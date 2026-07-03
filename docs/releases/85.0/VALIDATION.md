# Validation

```powershell
python -m compileall app
python -c "from app.main import app; print('App import OK')"
Select-String app\templates\base.html -Pattern "streaming_market_data_v85.css"
Select-String app\templates\workstation\_center_workspace.html -Pattern "streamingMarketDataBusPanelV85|candleStreamPanelV85|streamHealthPanelV85"
Select-String app\templates\workstation\_script_loader.html -Pattern "streaming_market_data_bus_v85|candle_stream_panel_v85|stream_health_panel_v85"
```

Browser console:

```javascript
typeof StreamingMarketDataBusV85
typeof CandleStreamPanelV85
typeof StreamHealthPanelV85
StreamingMarketDataBusV85.start()
StreamingMarketDataBusV85.snapshot()
```
