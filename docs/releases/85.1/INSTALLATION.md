# Version 85.1 — Platform Reorganization

## 1. Copy files

```powershell
Copy-Item payload\app\static\js\system\platform_module_inventory_v85_1.js app\static\js\system\platform_module_inventory_v85_1.js -Force
Copy-Item payload\app\static\js\system\loader_path_validator_v85_1.js app\static\js\system\loader_path_validator_v85_1.js -Force
Copy-Item payload\app\static\js\system\panel_id_validator_v85_1.js app\static\js\system\panel_id_validator_v85_1.js -Force
Copy-Item payload\app\static\css\platform_reorganization_v85_1.css app\static\css\platform_reorganization_v85_1.css -Force
```

## 2. Add CSS to `base.html`

```html
<link rel="stylesheet" href="/static/css/platform_reorganization_v85_1.css">
```

## 3. Add placeholders to `_center_workspace.html`

```html
<section id="platformModuleInventoryPanelV85_1"></section>
<section id="loaderPathValidatorPanelV85_1"></section>
<section id="panelIdValidatorPanelV85_1"></section>
```

## 4. Add scripts to `_script_loader.html`

```html
<script src="/static/js/system/platform_module_inventory_v85_1.js"></script>
<script src="/static/js/system/loader_path_validator_v85_1.js"></script>
<script src="/static/js/system/panel_id_validator_v85_1.js"></script>
```

## Canonical ownership

Market files such as `streaming_market_data_bus_v85.js` belong in:

```text
app/static/js/market/
```

The template folder location does not determine the static JS folder.
