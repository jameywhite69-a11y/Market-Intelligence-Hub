# Validation

```powershell
python -m compileall app
python -c "from app.main import app; print('App import OK')"
Select-String app\templates\base.html -Pattern "institutional_trade_engine_v59.css"
Select-String app\templates\workstation\_center_workspace.html -Pattern "institutionalTradeEnginePanel|institutionalDecisionQueuePanel|portfolioExposureEnginePanel"
Select-String app\templates\workstation\_script_loader.html -Pattern "institutional_trade_engine_v59|institutional_decision_queue_v59|portfolio_exposure_engine_v59"
```

Browser console:

```javascript
typeof InstitutionalTradeEngineV59
typeof InstitutionalDecisionQueueV59
typeof PortfolioExposureEngineV59
InstitutionalTradeEngineV59.current
```
