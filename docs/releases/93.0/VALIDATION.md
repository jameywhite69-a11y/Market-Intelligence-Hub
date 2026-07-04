# Validation

```powershell
python -m compileall app
python -c "from app.main import app; print('App import OK')"
Select-String app\templates\base.html -Pattern "portfolio_analytics_v93.css"
Select-String app\templates\workstation\_center_workspace.html -Pattern "portfolioAttributionEnginePanelV93|exposureAttributionPanelV93|performanceAttributionPanelV93|executionAttributionPanelV93"
Select-String app\templates\workstation\_script_loader.html -Pattern "portfolio_attribution_engine_v93|exposure_attribution_panel_v93|performance_attribution_panel_v93|execution_attribution_panel_v93"
```

Browser:

```javascript
typeof PortfolioAttributionEngineV93
typeof ExposureAttributionPanelV93
typeof PerformanceAttributionPanelV93
typeof ExecutionAttributionPanelV93
PortfolioAttributionEngineV93.build()
```
