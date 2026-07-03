# Validation

```powershell
python -m compileall app
python -c "from app.main import app; print('App import OK')"
Select-String app\templates\base.html -Pattern "live_opportunity_engine_v79.css"
Select-String app\templates\workstation\_center_workspace.html -Pattern "liveOpportunityEnginePanelV79|liveOpportunityTapePanelV79|liveOpportunityHealthPanelV79"
Select-String app\templates\workstation\_script_loader.html -Pattern "live_opportunity_engine_v79|live_opportunity_tape_v79|live_opportunity_health_v79"
```

Browser console:

```javascript
typeof LiveOpportunityEngineV79
typeof LiveOpportunityTapeV79
typeof LiveOpportunityHealthV79
RealtimeDataBusV74.start()
LiveOpportunityEngineV79.latest()
```
