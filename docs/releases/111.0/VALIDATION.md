# Validation

```powershell
python -m compileall app
python -c "from app.main import app; print('App import OK')"

Select-String app\templates\base.html -Pattern "risk_governance_v111.css"
Select-String app\templates\workstation\_center_workspace.html -Pattern "riskGovernanceEnginePanelV111|governanceViolationPanelV111|governanceHealthPanelV111"
Select-String app\templates\workstation\_script_loader.html -Pattern "risk_governance_engine_v111|governance_violation_panel_v111|governance_health_panel_v111"
```

Browser:

```javascript
typeof RiskGovernanceEngineV111
typeof GovernanceViolationPanelV111
typeof GovernanceHealthPanelV111
RiskGovernanceEngineV111.evaluate()
GovernanceHealthPanelV111.check()
```
