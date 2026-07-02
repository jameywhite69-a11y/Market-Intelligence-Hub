# Validation — Version 50.0

```powershell
python -m compileall app
python -m pytest tests
python -c "from app.main import app; print('App import OK')"
Select-String app\templates\base.html -Pattern "tios_layout_manager.css"
Select-String app\templates\workstation.html -Pattern "tios_panel_registry|tios_layout_manager|tiosLayoutManagerPanel"
```

Browser:

```text
http://127.0.0.1:8000/workstation?layout=50
```

Console:

```javascript
typeof TIOSPanelRegistry
typeof TIOSLayoutManager
typeof TIOSLayoutManagerPanel
TIOSPanelRegistry.all().length
TIOSLayoutManager.render()
document.body.dataset.tiosLayoutManager
```

Expected:
- all types return `"object"`
- dataset returns `"50.0"`
