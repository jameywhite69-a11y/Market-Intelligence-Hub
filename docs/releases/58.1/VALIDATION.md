# Validation

```powershell
python -m compileall app
python -c "from app.main import app; print('App import OK')"
Select-String app\templates\base.html -Pattern "ai_dock_stability_v58_1.css"
Select-String app\templates\workstation\_script_loader.html -Pattern "ai_dock_stability_controller_v58_1"
```

Browser console:

```javascript
typeof AIDockStabilityControllerV581
document.body.dataset.aiDockStability
```

Expected:

```javascript
"object"
"58.1"
```
