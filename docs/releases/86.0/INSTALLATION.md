# Version 86.0 — Module Manifest Loader

## 1. Copy files

```powershell
Copy-Item payload\app\static\js\system\module_manifest_loader_v86.js app\static\js\system\module_manifest_loader_v86.js -Force
Copy-Item payload\app\static\js\system\manifest_health_panel_v86.js app\static\js\system\manifest_health_panel_v86.js -Force
Copy-Item payload\app\static\css\module_manifest_loader_v86.css app\static\css\module_manifest_loader_v86.css -Force
```

## 2. Add CSS to `base.html`

```html
<link rel="stylesheet" href="/static/css/module_manifest_loader_v86.css">
```

## 3. Add placeholders to `_center_workspace.html`

Inside `.native-decision-grid`, near V85.1 validators:

```html
<section id="moduleManifestLoaderPanelV86"></section>
<section id="manifestHealthPanelV86"></section>
```

## 4. Add scripts to `_script_loader.html`

Add after V85.1 validators:

```html
<script src="/static/js/system/module_manifest_loader_v86.js"></script>
<script src="/static/js/system/manifest_health_panel_v86.js"></script>
```

## 5. Important

V86 is **validation-first**. It does not replace the existing manual loader yet. It prepares the project for a future manifest-driven loader without breaking the current working setup.
