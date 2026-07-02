# Version 50.0 — TIOS Layout Manager

This release introduces the Panel Registry and Layout Manager.

## 1. Copy files

```powershell
Copy-Item payload\app\static\js\layout app\static\js\layout -Recurse -Force
Copy-Item payload\app\static\css\tios_layout_manager.css app\static\css\tios_layout_manager.css -Force
```

## 2. Add CSS to `base.html`

```html
<link rel="stylesheet" href="/static/css/tios_layout_manager.css">
```

## 3. Add scripts to `workstation.html`

Add these as the final layout scripts, after your normal modules and after `institutional_dock_system.js`:

```html
<script src="/static/js/layout/tios_panel_registry.js"></script>
<script src="/static/js/layout/tios_layout_manager.js"></script>
<script src="/static/js/layout/tios_layout_manager_panel.js"></script>
```

## 4. Add a diagnostics panel placeholder

Add this in your right diagnostics/developer region:

```html
<section id="tiosLayoutManagerPanel"></section>
```

## 5. Do not replace workstation.html

This is a runtime layout system. It works with your current workstation template.
