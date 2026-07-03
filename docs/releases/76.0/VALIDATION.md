# Validation

```powershell
python -m compileall app
python -c "from app.main import app; print('App import OK')"
Select-String app\templates\base.html -Pattern "module_registry_v76.css"
Select-String app\templates\workstation\_center_workspace.html -Pattern "moduleRegistryPanelV76|moduleLifecyclePanelV76|moduleDependencyHealthPanelV76"
Select-String app\templates\workstation\_script_loader.html -Pattern "module_registry_v76|module_lifecycle_panel_v76|module_dependency_health_v76"
```

Browser console:

```javascript
typeof ModuleRegistryV76
typeof ModuleLifecyclePanelV76
typeof ModuleDependencyHealthV76
ModuleRegistryV76.snapshot()
```
