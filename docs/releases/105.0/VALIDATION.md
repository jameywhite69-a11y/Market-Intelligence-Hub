# Validation

```powershell
python -m compileall app
python -c "from app.main import app; print('App import OK')"

Select-String app\templates\base.html -Pattern "institutional_analytics_v105.css"
Select-String app\templates\workstation\_center_workspace.html -Pattern "institutionalAnalyticsEnginePanelV105|riskAdjustedPerformancePanelV105|tradeExpectancyPanelV105|analyticsHealthPanelV105"
Select-String app\templates\workstation\_script_loader.html -Pattern "institutional_analytics_engine_v105|risk_adjusted_performance_panel_v105|trade_expectancy_panel_v105|analytics_health_panel_v105"
```

Browser:

```javascript
typeof InstitutionalAnalyticsEngineV105
typeof RiskAdjustedPerformancePanelV105
typeof TradeExpectancyPanelV105
typeof AnalyticsHealthPanelV105
InstitutionalAnalyticsEngineV105.calc()
AnalyticsHealthPanelV105.check()
```
