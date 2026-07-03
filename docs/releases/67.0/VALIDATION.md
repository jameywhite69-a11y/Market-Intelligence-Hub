# Validation

```powershell
python -m compileall app
python -c "from app.main import app; print('App import OK')"
Select-String app\templates\base.html -Pattern "portfolio_performance_analytics_v67.css"
Select-String app\templates\workstation\_center_workspace.html -Pattern "performanceDashboardV67Panel|equityCurvePanelV67|strategyRankingPanelV67"
Select-String app\templates\workstation\_script_loader.html -Pattern "performance_analytics_engine_v67|performance_dashboard_v67|equity_curve_panel_v67|strategy_ranking_panel_v67"
```

Browser console:

```javascript
typeof PerformanceAnalyticsEngineV67
typeof PerformanceDashboardV67
typeof EquityCurvePanelV67
typeof StrategyRankingPanelV67
PerformanceAnalyticsEngineV67.metrics()
```
