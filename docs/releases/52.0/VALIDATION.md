# Validation

```powershell
python -m compileall app
python -m pytest tests
python -c "from app.main import app; print('App import OK')"
Select-String app\templates\base.html -Pattern "native_tios_workstation.css"
Select-String app\templates\workstation.html -Pattern "nativeTIOSWorkstation|tios_layout_manager.js|core_bootstrap|scanner_selection_unifier"
```

Expected:
- `nativeTIOSWorkstation` appears.
- `tios_layout_manager.js` does not appear.
- `core_bootstrap` appears once.
- `scanner_selection_unifier` appears once.
