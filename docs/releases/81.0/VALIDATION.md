# Validation

```powershell
python -m compileall app
python -c "from app.main import app; print('App import OK')"
Select-String app\templates\base.html -Pattern "position_risk_manager_v81.css"
Select-String app\templates\workstation\_center_workspace.html -Pattern "positionRiskManagerPanelV81|positionLifecycleDashboardV81|stopTargetManagerPanelV81"
Select-String app\templates\workstation\_script_loader.html -Pattern "position_risk_manager_v81|position_lifecycle_dashboard_v81|stop_target_manager_v81"
```

Browser console:

```javascript
typeof PositionRiskManagerV81
typeof PositionLifecycleDashboardV81
typeof StopTargetManagerV81
PositionRiskManagerV81.analyze()
```
