# Rollback

```powershell
Copy-Item app\templates\workstation.pre52.backup.html app\templates\workstation.html -Force
```

Remove from base.html:

```html
<link rel="stylesheet" href="/static/css/native_tios_workstation.css">
```
