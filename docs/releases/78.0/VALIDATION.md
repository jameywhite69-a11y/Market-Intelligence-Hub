# Validation

```powershell
python -m compileall app
python -c "from app.main import app; print('App import OK')"
Select-String app\templates\base.html -Pattern "live_data_adapter_v78.css"
Select-String app\templates\workstation\_center_workspace.html -Pattern "marketDataAdapterRegistryPanelV78|realtimeAdapterBridgePanelV78|dataProviderHealthPanelV78"
Select-String app\templates\workstation\_script_loader.html -Pattern "market_data_adapter_registry_v78|realtime_data_bus_adapter_bridge_v78|data_provider_health_panel_v78"
```

Browser console:

```javascript
typeof MarketDataAdapterRegistryV78
typeof RealtimeDataBusAdapterBridgeV78
typeof DataProviderHealthPanelV78
MarketDataAdapterRegistryV78.snapshot()
RealtimeDataBusAdapterBridgeV78.adapterTick()
```
