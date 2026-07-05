# Validation

```powershell
python -m compileall app
python -c "from app.main import app; print('App import OK')"

Select-String app\templates\base.html -Pattern "native_workstation_navigation_v108_1.css"
Select-String app\templates\workstation\_script_loader.html -Pattern "native_workstation_navigation_v108_1"
```

Browser:

```javascript
typeof NativeWorkstationNavigationV108_1
NativeWorkstationNavigationV108_1.version
NativeWorkstationNavigationV108_1.render()
NativeWorkstationNavigationV108_1.scrollToTarget("portfolioSummaryCards")
```

Expected:

```text
"object"
"108.1"
```
