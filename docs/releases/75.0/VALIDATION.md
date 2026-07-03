# Validation

```powershell
python -m compileall app
python -c "from app.main import app; print('App import OK')"
Select-String app\templates\base.html -Pattern "core_event_dispatcher_v75.css"
Select-String app\templates\workstation\_center_workspace.html -Pattern "coreEventDispatcherPanelV75|canonicalStateViewerPanelV75|eventPipelineHealthPanelV75"
Select-String app\templates\workstation\_script_loader.html -Pattern "core_event_dispatcher_v75|canonical_state_viewer_v75|event_pipeline_health_v75"
```

Browser console:

```javascript
typeof CoreEventDispatcherV75
typeof CanonicalStateViewerV75
typeof EventPipelineHealthV75
CoreEventDispatcherV75.snapshot()
```
