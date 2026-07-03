# Validation

```powershell
python -m compileall app
python -c "from app.main import app; print('App import OK')"
Select-String app\templates\base.html -Pattern "release_candidate_v70.css"
Select-String app\templates\workstation\_center_workspace.html -Pattern "releaseCandidateDashboardV70Panel|platformSettingsPanelV70|deploymentChecklistPanelV70"
Select-String app\templates\workstation\_script_loader.html -Pattern "platform_settings_store_v70|release_candidate_dashboard_v70|deployment_checklist_v70"
```

Browser console:

```javascript
typeof ReleaseCandidateDashboardV70
typeof PlatformSettingsStoreV70
typeof DeploymentChecklistV70
ReleaseCandidateDashboardV70.check()
```
