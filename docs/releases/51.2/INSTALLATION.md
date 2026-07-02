# Version 51.2 — Startup Ownership Analyzer

## 1. Copy files

```powershell
Copy-Item payload\app\static\js\core\startup_ownership_analyzer.js app\static\js\core\startup_ownership_analyzer.js -Force
Copy-Item payload\app\static\js\core\startup_ownership_panel.js app\static\js\core\startup_ownership_panel.js -Force
Copy-Item payload\app\static\css\startup_ownership_analyzer.css app\static\css\startup_ownership_analyzer.css -Force
```

## 2. Add CSS to `base.html`

```html
<link rel="stylesheet" href="/static/css/startup_ownership_analyzer.css">
```

## 3. Add panel placeholder to `workstation.html`

```html
<section id="startupOwnershipPanel"></section>
```

## 4. Add scripts to `workstation.html`

Add analyzer very early, immediately after `event_bus.js`:

```html
<script src="/static/js/core/startup_ownership_analyzer.js"></script>
```

Add panel late:

```html
<script src="/static/js/core/startup_ownership_panel.js"></script>
```

## 5. Restart and open

```powershell
python -m uvicorn app.main:app --reload
```

```text
http://127.0.0.1:8000/workstation?ownership=512
```
