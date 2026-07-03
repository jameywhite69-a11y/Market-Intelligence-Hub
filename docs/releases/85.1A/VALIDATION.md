# Validation

```powershell
Test-Path app\static\js\system\platform_module_inventory_v85_1.js
Test-Path app\static\js\system\loader_path_validator_v85_1.js
Test-Path app\static\js\system\panel_id_validator_v85_1.js

Test-Path app\static\js\market\platform_module_inventory_v85_1.js
Test-Path app\static\js\market\loader_path_validator_v85_1.js
Test-Path app\static\js\market\panel_id_validator_v85_1.js

python -m compileall app
python -c "from app.main import app; print('App import OK')"
```

Expected:

```text
system files: True
market duplicate files: False
App import OK
```

Browser:

```javascript
typeof PlatformModuleInventoryV851
typeof LoaderPathValidatorV851
typeof PanelIdValidatorV851
LoaderPathValidatorV851.validate()
PanelIdValidatorV851.validate()
```
