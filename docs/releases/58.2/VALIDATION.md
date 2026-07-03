# Validation

```powershell
python -m compileall app
python -c "from app.main import app; print('App import OK')"
Select-String app\templates\base.html -Pattern "ai_dock_state_subscriber_v58_2.css"
Select-String app\templates\workstation\_script_loader.html -Pattern "ai_dock_state_subscriber_v58_2|ai_dock_stability_controller_v58_1"
```

Browser console:

```javascript
typeof AIDockStateSubscriberV582
document.body.dataset.aiDockStateSubscriber
document.querySelector('[data-dock-panel="ai"]').dataset.aiDockStateSubscriber
```

Expected:

```javascript
"object"
"58.2"
"58.2"
```
