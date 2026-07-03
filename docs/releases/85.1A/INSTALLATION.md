# Version 85.1A — System Path Correction

Run from the project root:

```powershell
New-Item -ItemType Directory -Force app\static\js\system

Move-Item app\static\js\market\platform_module_inventory_v85_1.js app\static\js\system\platform_module_inventory_v85_1.js -Force
Move-Item app\static\js\market\loader_path_validator_v85_1.js app\static\js\system\loader_path_validator_v85_1.js -Force
Move-Item app\static\js\market\panel_id_validator_v85_1.js app\static\js\system\panel_id_validator_v85_1.js -Force
```

Keep `_script_loader.html` as-is:

```html
<script src="/static/js/system/platform_module_inventory_v85_1.js"></script>
<script src="/static/js/system/loader_path_validator_v85_1.js"></script>
<script src="/static/js/system/panel_id_validator_v85_1.js"></script>
```
