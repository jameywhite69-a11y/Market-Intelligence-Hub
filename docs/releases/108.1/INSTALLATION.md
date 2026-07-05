# Version 108.1 — Native Workstation Navigation

This replaces the injected V107.1 toolbar with a native workstation navigation panel inserted into `.native-center-top`.

## Copy files

```powershell
Copy-Item payload\app\static\js\system\native_workstation_navigation_v108_1.js app\static\js\system\native_workstation_navigation_v108_1.js -Force
Copy-Item payload\app\static\css\native_workstation_navigation_v108_1.css app\static\css\native_workstation_navigation_v108_1.css -Force
```

## Add CSS to `base.html`

```html
<link rel="stylesheet" href="/static/css/native_workstation_navigation_v108_1.css">
```

## Add script to `_script_loader.html`

Add near final system integrations, after V107/V108 modules:

```html
<script src="/static/js/system/native_workstation_navigation_v108_1.js"></script>
```

## Optional cleanup

If V107.1 is still loaded and you want to avoid two navigation systems, remove or comment:

```html
<script src="/static/js/system/workstation_navigation_system_v107_1.js"></script>
<link rel="stylesheet" href="/static/css/workstation_navigation_v107_1.css">
```

No `_center_workspace.html` placeholder is required. This module injects itself into the existing top workspace area.
