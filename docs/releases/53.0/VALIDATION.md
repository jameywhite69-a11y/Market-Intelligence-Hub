# Validation

```powershell
python -m compileall app
python -m pytest tests
python -c "from app.main import app; print('App import OK')"
Select-String app\templates\base.html -Pattern "native_tios_v53.css"
Select-String app\templates\workstation_v53.html -Pattern "nativeTIOSWorkstation|workstation-decision-zone|tios_layout_manager.js|core_bootstrap|scanner_selection_unifier"
Select-String app\main.py -Pattern "workstation_v53"
```

Expected:
- `nativeTIOSWorkstation` appears.
- `workstation-decision-zone` should not appear in `workstation_v53.html`.
- `tios_layout_manager.js` should not appear.
- `core_bootstrap` appears once.
- `scanner_selection_unifier` appears once.
