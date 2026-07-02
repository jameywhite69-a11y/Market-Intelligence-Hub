# Version 53.0 — Native TIOS Migration

This release creates a clean native route and starts the migration away from the legacy workstation.

## 1. Copy files

```powershell
Copy-Item payload\app\templates\workstation_v53.html app\templates\workstation_v53.html -Force
Copy-Item payload\app\static\css\native_tios_v53.css app\static\css\native_tios_v53.css -Force
```

## 2. Add CSS to `base.html`

```html
<link rel="stylesheet" href="/static/css/native_tios_v53.css">
```

## 3. Add route to `app/main.py`

```python
@app.get("/workstation_v53", response_class=HTMLResponse)
async def workstation_v53(request: Request):
    return templates.TemplateResponse(
        "workstation_v53.html",
        {"request": request}
    )
```

## 4. Open

```text
http://127.0.0.1:8000/workstation_v53
```

This does not replace the legacy workstation.
