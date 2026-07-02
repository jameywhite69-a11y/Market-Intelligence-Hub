# Validation

```powershell
python -m compileall app
python -m pytest tests
python -c "from app.main import app; print('App import OK')"
Select-String app\templates\base.html -Pattern "native_tios_workstation.css"
Select-String app\templates\workstation_v52.html -Pattern "nativeTIOSWorkstation|workstation-decision-zone|tios_layout_manager.js|core_bootstrap"
Select-String app\main.py -Pattern "workstation_v52"
```

Expected:
- `nativeTIOSWorkstation` appears.
- `workstation-decision-zone` does **not** appear.
- `tios_layout_manager.js` does **not** appear.
- `core_bootstrap` appears once.
