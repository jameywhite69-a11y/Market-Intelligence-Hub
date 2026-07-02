# Validation

```powershell
python -m compileall app
python -c "from app.main import app; print('App import OK')"
Select-String app\templates\base.html -Pattern "production_workspace_v55.css"
Select-String app\templates\workstation_v53.html -Pattern "tradeExecutionPlannerPanel|riskMatrixPanel|developer_mode_controller_v55|trade_execution_planner_v55|risk_matrix_panel_v55"
```

Browser console:

```javascript
typeof DeveloperModeControllerV55
typeof TradeExecutionPlannerV55
typeof RiskMatrixPanelV55
DeveloperModeControllerV55.enabled()
```

Expected:
- all type checks return `"object"`
- developer mode defaults off unless you previously toggled it on.
