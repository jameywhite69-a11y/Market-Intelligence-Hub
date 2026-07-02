# Validation

```powershell
python -m compileall app
python -c "from app.main import app; print('App import OK')"
Select-String app\templates\base.html -Pattern "unified_decision_engine_v57.css"
Select-String app\templates\workstation\_center_workspace.html -Pattern "unifiedDecisionEnginePanel|positionSizeCalculatorPanel|opportunityTimelineV57Panel"
Select-String app\templates\workstation\_script_loader.html -Pattern "unified_decision_engine_v57|position_size_calculator_v57|opportunity_timeline_v57"
```

Browser console:

```javascript
typeof UnifiedDecisionEngineV57
UnifiedDecisionEngineV57.get()
typeof PositionSizeCalculatorV57
typeof OpportunityTimelineV57
```
