# Validation

```powershell
python -m compileall app
python -c "from app.main import app; print('App import OK')"

Select-String app\templates\workstation\_script_loader.html -Pattern "event_bus|event_state_engine_v58|state_render_scheduler_v58" -Context 1,2
```

Browser console:

```javascript
typeof TIOSEventStateEngineV58
typeof TIOSRenderSchedulerV58
document.body.dataset.eventStateEngine
TIOSEventStateEngineV58.report()
```

Expected:

```javascript
"object"
"object"
"58.0"
```

Then click several opportunities and run:

```javascript
TIOSEventStateEngineV58.report()
```

You should see suppressed counts increasing if duplicate event storms occur.
