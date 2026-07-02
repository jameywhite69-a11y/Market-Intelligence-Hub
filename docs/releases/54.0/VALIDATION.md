# Validation

```powershell
python -m compileall app
python -c "from app.main import app; print('App import OK')"
Select-String app\templates\base.html -Pattern "ai_trading_commander_v54.css"
Select-String app\templates\workstation_v53.html -Pattern "aiTradingCommanderPanel|institutionalScorecardPanel|compactDecisionPipelinePanel|ai_trading_commander_panel|institutional_scorecard_panel_v54|compact_decision_pipeline_v54"
```

Browser console:

```javascript
typeof AITradingCommanderPanel
typeof InstitutionalScorecardPanelV54
typeof CompactDecisionPipelineV54
```

Expected: all return `"object"`.
