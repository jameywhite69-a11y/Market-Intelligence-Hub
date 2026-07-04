# Version 98.0 — Plugin SDK Foundation

Copy:

```powershell
Copy-Item payload\app\static\js\system\plugin_sdk_v98.js app\static\js\system\plugin_sdk_v98.js -Force
Copy-Item payload\app\static\js\system\plugin_marketplace_v98.js app\static\js\system\plugin_marketplace_v98.js -Force
Copy-Item payload\app\static\css\plugin_sdk_v98.css app\static\css\plugin_sdk_v98.css -Force
```

Add to `base.html`:

```html
<link rel="stylesheet" href="/static/css/plugin_sdk_v98.css">
```

Add to workspace:

```html
<section id="pluginSdkPanelV98"></section>
<section id="pluginMarketplacePanelV98"></section>
```

Add to `_script_loader.html`:

```html
<script src="/static/js/system/plugin_sdk_v98.js"></script>
<script src="/static/js/system/plugin_marketplace_v98.js"></script>
```
