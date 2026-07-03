# Version 72.0 — Workspace Persistence and Layout Manager

## 1. Copy files

```powershell
Copy-Item payload\app\static\js\workspace\workspace_persistence_manager_v72.js app\static\js\workspace\workspace_persistence_manager_v72.js -Force
Copy-Item payload\app\static\js\workspace\layout_profile_manager_v72.js app\static\js\workspace\layout_profile_manager_v72.js -Force
Copy-Item payload\app\static\css\workspace_persistence_v72.css app\static\css\workspace_persistence_v72.css -Force
```

## 2. Add CSS to `base.html`

```html
<link rel="stylesheet" href="/static/css/workspace_persistence_v72.css">
```

## 3. Add placeholders to `_center_workspace.html`

Inside `.native-decision-grid`:

```html
<section id="workspacePersistencePanelV72"></section>
<section id="layoutProfileManagerPanelV72"></section>
```

## 4. Add scripts to `_script_loader.html`

Add near workspace/system finalizer scripts:

```html
<script src="/static/js/workspace/workspace_persistence_manager_v72.js"></script>
<script src="/static/js/workspace/layout_profile_manager_v72.js"></script>
```
