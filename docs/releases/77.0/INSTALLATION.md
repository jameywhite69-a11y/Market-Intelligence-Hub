# Version 77.0 — Native Docking and Layout Engine

## 1. Copy files

```powershell
Copy-Item payload\app\static\js\workspace\panel_registry_v77.js app\static\js\workspace\panel_registry_v77.js -Force
Copy-Item payload\app\static\js\workspace\native_docking_manager_v77.js app\static\js\workspace\native_docking_manager_v77.js -Force
Copy-Item payload\app\static\js\workspace\dock_state_inspector_v77.js app\static\js\workspace\dock_state_inspector_v77.js -Force
Copy-Item payload\app\static\css\native_docking_v77.css app\static\css\native_docking_v77.css -Force
```

## 2. Add CSS to `base.html`

```html
<link rel="stylesheet" href="/static/css/native_docking_v77.css">
```

## 3. Add placeholders to `_center_workspace.html`

Inside `.native-decision-grid`:

```html
<section id="nativeDockingManagerPanelV77"></section>
<section id="dockStateInspectorPanelV77"></section>
```

## 4. Add scripts to `_script_loader.html`

Add after V76 module registry scripts and after existing workspace persistence scripts:

```html
<script src="/static/js/workspace/panel_registry_v77.js"></script>
<script src="/static/js/workspace/native_docking_manager_v77.js"></script>
<script src="/static/js/workspace/dock_state_inspector_v77.js"></script>
```

## 5. Usage

- Click **Discover Panels**
- Click **Decorate Panels**
- Use each panel toolbar:
  - Float
  - Dock
  - Collapse
- Floating positions are saved locally.
