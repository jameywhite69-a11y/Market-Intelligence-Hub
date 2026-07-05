# Version 107.1 — Workstation Navigation System

```powershell
Copy-Item payload\app\static\js\system\workstation_navigation_system_v107_1.js app\static\js\system\workstation_navigation_system_v107_1.js -Force
Copy-Item payload\app\static\css\workstation_navigation_v107_1.css app\static\css\workstation_navigation_v107_1.css -Force
```

Add CSS to `base.html`:

```html
<link rel="stylesheet" href="/static/css/workstation_navigation_v107_1.css">
```

Add script near final system integrations in `_script_loader.html`:

```html
<script src="/static/js/system/workstation_navigation_system_v107_1.js"></script>
```

No `_center_workspace.html` placeholder is required. The navigation bar and floating Home button are injected automatically.
