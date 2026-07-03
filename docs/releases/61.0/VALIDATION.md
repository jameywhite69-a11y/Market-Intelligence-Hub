# Validation

```powershell
python -m compileall app
python -c "from app.main import app; print('App import OK')"
Select-String app\templates\base.html -Pattern "market_intelligence_core_v61.css"
Select-String app\templates\workstation\_center_workspace.html -Pattern "marketRegimeEnginePanel|relativeStrengthRankingsPanel|marketBreadthPanelV61|institutionalFlowPanelV61"
Select-String app\templates\workstation\_script_loader.html -Pattern "market_regime_engine_v61|relative_strength_rankings_v61|market_breadth_panel_v61|institutional_flow_panel_v61"
```

Browser console:

```javascript
typeof MarketRegimeEngineV61
typeof RelativeStrengthRankingsV61
typeof MarketBreadthPanelV61
typeof InstitutionalFlowPanelV61
```
