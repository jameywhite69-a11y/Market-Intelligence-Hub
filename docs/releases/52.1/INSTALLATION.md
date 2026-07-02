# Version 52.1 — Native Workstation Route

This release does **not** replace your current `/workstation`. It adds a separate native route.

## 1. Copy files

```powershell
Copy-Item payload\app\templates\workstation_v52.html app\templates\workstation_v52.html -Force
Copy-Item payload\app\static\css\native_tios_workstation.css app\static\css\native_tios_workstation.css -Force
```

## 2. Add CSS to `base.html`

```html
<link rel="stylesheet" href="/static/css/native_tios_workstation.css">
```

## 3. Add route to `app/main.py`

Add this near your existing workstation route:

```python
@app.get("/workstation_v52", response_class=HTMLResponse)
async def workstation_v52(request: Request):
    return templates.TemplateResponse(
        "workstation_v52.html",
        {"request": request}
    )
```

## 4. Open the native route

```text
http://127.0.0.1:8000/workstation_v52
```

This leaves the legacy `/workstation` untouched.
