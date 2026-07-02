# v49 Install

Copy:
```powershell
Copy-Item payload\app\templates\workstation.html app\templates\workstation.html -Force
Copy-Item payload\app\static\css\tios_professional_layout.css app\static\css\tios_professional_layout.css -Force
Copy-Item payload\app\static\js\workstation\institutional_dock_system.js app\static\js\workstation\institutional_dock_system.js -Force
```

Add to `base.html`:
```html
<link rel="stylesheet" href="/static/css/tios_professional_layout.css">
```

Remove old layout links if present:
```html
<link rel="stylesheet" href="/static/css/professional_decision_workspace.css">
<link rel="stylesheet" href="/static/css/workstation_decision_zone.css">
```
