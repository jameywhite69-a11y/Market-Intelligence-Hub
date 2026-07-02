# Version 49.1 — Inventory-Based Workstation

Copy the CSS and dock system:

```powershell
Copy-Item payload\app\static\css\tios_professional_layout.css app\static\css\tios_professional_layout.css -Force
Copy-Item payload\app\static\js\workstation\institutional_dock_system.js app\static\js\workstation\institutional_dock_system.js -Force
```

Copy the generator:

```powershell
Copy-Item tools\generate_workstation_v49_1.py tools\generate_workstation_v49_1.py -Force
```

Add to `base.html`:

```html
<link rel="stylesheet" href="/static/css/tios_professional_layout.css">
```

Remove old layout CSS links if present:

```html
<link rel="stylesheet" href="/static/css/professional_decision_workspace.css">
<link rel="stylesheet" href="/static/css/workstation_decision_zone.css">
```

Generate `workstation.html` from your actual repo inventory:

```powershell
python tools\generate_workstation_v49_1.py
```
