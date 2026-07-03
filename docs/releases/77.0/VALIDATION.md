# Validation

```powershell
python -m compileall app
python -c "from app.main import app; print('App import OK')"
Select-String app\templates\base.html -Pattern "native_docking_v77.css"
Select-String app\templates\workstation\_center_workspace.html -Pattern "nativeDockingManagerPanelV77|dockStateInspectorPanelV77"
Select-String app\templates\workstation\_script_loader.html -Pattern "panel_registry_v77|native_docking_manager_v77|dock_state_inspector_v77"
```

Browser console:

```javascript
typeof PanelRegistryV77
typeof NativeDockingManagerV77
typeof DockStateInspectorV77
PanelRegistryV77.snapshot()
NativeDockingManagerV77.snapshot()
```
