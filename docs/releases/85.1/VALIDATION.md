```powershell
python -m compileall app
python -c "from app.main import app; print('App import OK')"
Select-String app\templates\base.html -Pattern "platform_reorganization_v85_1.css"
Select-String app\templates\workstation\_center_workspace.html -Pattern "platformModuleInventoryPanelV85_1|loaderPathValidatorPanelV85_1|panelIdValidatorPanelV85_1"
Select-String app\templates\workstation\_script_loader.html -Pattern "platform_module_inventory_v85_1|loader_path_validator_v85_1|panel_id_validator_v85_1"
```

Browser:
```javascript
typeof PlatformModuleInventoryV851
typeof LoaderPathValidatorV851
typeof PanelIdValidatorV851
LoaderPathValidatorV851.validate()
PanelIdValidatorV851.validate()
```
