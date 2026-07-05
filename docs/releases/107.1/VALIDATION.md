# Validation

```powershell
python -m compileall app
python -c "from app.main import app; print('App import OK')"

Select-String app\templates\base.html -Pattern "workstation_navigation_v107_1.css"
Select-String app\templates\workstation\_script_loader.html -Pattern "workstation_navigation_system_v107_1"
```

Browser:

```javascript
typeof WorkstationNavigationSystemV107_1
WorkstationNavigationSystemV107_1.version
WorkstationNavigationSystemV107_1.sections
WorkstationNavigationSystemV107_1.scrollToTarget("top")
```

Expected:

```text
"object"
"107.1"
```
