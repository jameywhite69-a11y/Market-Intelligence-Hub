# Version 52.0 — Native TIOS Workstation

## 1. Backup

```powershell
Copy-Item app\templates\workstation.html app\templates\workstation.pre52.backup.html -Force
```

## 2. Copy payload

```powershell
Copy-Item payload\app\templates\workstation.html app\templates\workstation.html -Force
Copy-Item payload\app\static\css\native_tios_workstation.css app\static\css\native_tios_workstation.css -Force
```

## 3. Add CSS to base.html

```html
<link rel="stylesheet" href="/static/css/native_tios_workstation.css">
```

## 4. Remove obsolete layout CSS links if present

```html
<link rel="stylesheet" href="/static/css/runtime_layout_composer.css">
<link rel="stylesheet" href="/static/css/tios_professional_layout.css">
```

## 5. Note

Version 52.0 does not load `tios_layout_manager.js`; the native template owns the layout directly.
