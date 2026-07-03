# Validation

```powershell
python -m compileall app
python -c "from app.main import app; print('App import OK')"
Select-String app\templates\base.html -Pattern "workspace_persistence_v72.css"
Select-String app\templates\workstation\_center_workspace.html -Pattern "workspacePersistencePanelV72|layoutProfileManagerPanelV72"
Select-String app\templates\workstation\_script_loader.html -Pattern "workspace_persistence_manager_v72|layout_profile_manager_v72"
```

Browser console:

```javascript
typeof WorkspacePersistenceManagerV72
typeof LayoutProfileManagerV72
WorkspacePersistenceManagerV72.load()
```
