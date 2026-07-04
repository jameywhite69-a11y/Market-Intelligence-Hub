# Validation

```powershell
python -m compileall app
python -c "from app.main import app; print('App import OK')"
Select-String app\templates\base.html -Pattern "workspace_consolidation_v96.css"
Select-String app\templates\workstation\_center_workspace.html -Pattern "workspaceConsolidationPanelV96|workspaceSectionHealthPanelV96|workstationReleaseSummaryPanelV96"
Select-String app\templates\workstation\_script_loader.html -Pattern "workspace_consolidation_engine_v96|workspace_section_health_v96|workstation_release_summary_v96"
```

Browser:

```javascript
typeof WorkspaceConsolidationEngineV96
typeof WorkspaceSectionHealthV96
typeof WorkstationReleaseSummaryV96
WorkspaceConsolidationEngineV96.snapshot()
WorkstationReleaseSummaryV96.collect()
```
