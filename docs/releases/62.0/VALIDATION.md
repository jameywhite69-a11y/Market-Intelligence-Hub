# Validation

```powershell
python -m compileall app
python -c "from app.main import app; print('App import OK')"
Select-String app\templates\base.html -Pattern "institutional_market_context_v62.css"
Select-String app\templates\workstation\_center_workspace.html -Pattern "institutionalMarketContextPanel|marketContextDashboardV62Panel|marketContextAIBridgePanel"
Select-String app\templates\workstation\_script_loader.html -Pattern "institutional_market_context_engine_v62|market_context_dashboard_v62|market_context_ai_bridge_v62"
```

Browser console:

```javascript
typeof InstitutionalMarketContextEngineV62
typeof MarketContextDashboardV62
typeof MarketContextAIBridgeV62
InstitutionalMarketContextEngineV62.get()
```
