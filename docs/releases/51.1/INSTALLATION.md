# Version 51.1 — Architecture Discovery + Startup Trace

## 1. Copy files

```powershell
Copy-Item payload\app\static\js\core\startup_trace.js app\static\js\core\startup_trace.js -Force
Copy-Item payload\app\static\js\core\startup_trace_panel.js app\static\js\core\startup_trace_panel.js -Force
Copy-Item payload\app\static\css\startup_trace.css app\static\css\startup_trace.css -Force
```

## 2. Add CSS to `base.html`

```html
<link rel="stylesheet" href="/static/css/startup_trace.css">
```

## 3. Add panel placeholder to `workstation.html`

Add this to diagnostics/developer/right region:

```html
<section id="startupTracePanel"></section>
```

## 4. Add scripts to `workstation.html`

Add `startup_trace.js` early, right after EventBus if possible:

```html
<script src="/static/js/core/startup_trace.js"></script>
```

Add `startup_trace_panel.js` late, near the end:

```html
<script src="/static/js/core/startup_trace_panel.js"></script>
```

## 5. Restart and hard refresh

```powershell
python -m uvicorn app.main:app --reload
```

Open:

```text
http://127.0.0.1:8000/workstation?trace=511
```
