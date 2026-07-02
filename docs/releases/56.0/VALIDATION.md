# Validation

```powershell
python -m compileall app
python -c "from app.main import app; print('App import OK')"
Select-String app\templates\base.html -Pattern "institutional_scanner_v56.css"
Select-String app\templates\workstation\_center_workspace.html -Pattern "institutionalWatchlistPanel|institutionalHeatmapV56Panel|executionReadinessPanel"
Select-String app\templates\workstation\_script_loader.html -Pattern "institutional_scanner_engine_v56"
```

Browser console:

```javascript
typeof TIOSInstitutionalScannerV56
TIOSInstitutionalScannerV56.scan()
```
