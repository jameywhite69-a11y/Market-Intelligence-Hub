# Validation

```powershell
python -m compileall app
python -c "from app.main import app; print('App import OK')"
Select-String app\templates\base.html -Pattern "module_manifest_loader_v86.css"
Select-String app\templates\workstation\_center_workspace.html -Pattern "moduleManifestLoaderPanelV86|manifestHealthPanelV86"
Select-String app\templates\workstation\_script_loader.html -Pattern "module_manifest_loader_v86|manifest_health_panel_v86"
```

Browser console:

```javascript
typeof ModuleManifestLoaderV86
typeof ManifestHealthPanelV86
ModuleManifestLoaderV86.validate()
ModuleManifestLoaderV86.exportManifest()
```
