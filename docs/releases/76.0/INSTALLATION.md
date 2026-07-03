# Version 76.0 — Module Registry and Lifecycle Manager

## 1. Copy files

```powershell
Copy-Item payload\app\static\js\core\module_registry_v76.js app\static\js\core\module_registry_v76.js -Force
Copy-Item payload\app\static\js\core\module_lifecycle_panel_v76.js app\static\js\core\module_lifecycle_panel_v76.js -Force
Copy-Item payload\app\static\js\core\module_dependency_health_v76.js app\static\js\core\module_dependency_health_v76.js -Force
Copy-Item payload\app\static\css\module_registry_v76.css app\static\css\module_registry_v76.css -Force
```

## 2. Add CSS to `base.html`

```html
<link rel="stylesheet" href="/static/css/module_registry_v76.css">
```

## 3. Add placeholders to `_center_workspace.html`

Inside `.native-decision-grid`:

```html
<section id="moduleRegistryPanelV76"></section>
<section id="moduleLifecyclePanelV76"></section>
<section id="moduleDependencyHealthPanelV76"></section>
```

## 4. Add scripts to `_script_loader.html`

Add after the V75 core dispatcher scripts:

```html
<script src="/static/js/core/module_registry_v76.js"></script>
<script src="/static/js/core/module_lifecycle_panel_v76.js"></script>
<script src="/static/js/core/module_dependency_health_v76.js"></script>
```
