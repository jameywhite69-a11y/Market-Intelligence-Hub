# Version 73.0 — Unified Settings and Configuration

## 1. Copy files

```powershell
New-Item -ItemType Directory -Force app\static\js\settings
Copy-Item payload\app\static\js\settings\unified_settings_store_v73.js app\static\js\settings\unified_settings_store_v73.js -Force
Copy-Item payload\app\static\js\settings\settings_health_panel_v73.js app\static\js\settings\settings_health_panel_v73.js -Force
Copy-Item payload\app\static\css\unified_settings_v73.css app\static\css\unified_settings_v73.css -Force
```

## 2. Add CSS to `base.html`

```html
<link rel="stylesheet" href="/static/css/unified_settings_v73.css">
```

## 3. Add placeholders to `_center_workspace.html`

Inside `.native-decision-grid`:

```html
<section id="unifiedSettingsPanelV73"></section>
<section id="settingsHealthPanelV73"></section>
```

## 4. Add scripts to `_script_loader.html`

Add near workspace/system settings scripts:

```html
<script src="/static/js/settings/unified_settings_store_v73.js"></script>
<script src="/static/js/settings/settings_health_panel_v73.js"></script>
```
