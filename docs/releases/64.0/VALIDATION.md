# Validation

```powershell
python -m compileall app
python -c "from app.main import app; print('App import OK')"
Select-String app\templates\base.html -Pattern "institutional_portfolio_intelligence_v64.css"
Select-String app\templates\workstation\_center_workspace.html -Pattern "portfolioHealthDashboardV64Panel|portfolioExposureEngineV64Panel|portfolioCorrelationEngineV64Panel|riskBudgetEngineV64Panel"
Select-String app\templates\workstation\_script_loader.html -Pattern "portfolio_intelligence_store_v64|exposure_engine_v64|correlation_engine_v64|risk_budget_engine_v64|portfolio_health_dashboard_v64"
```

Browser console:

```javascript
typeof PortfolioIntelligenceStoreV64
typeof ExposureEngineV64
typeof CorrelationEngineV64
typeof RiskBudgetEngineV64
typeof PortfolioHealthDashboardV64
PortfolioIntelligenceStoreV64.get()
```
