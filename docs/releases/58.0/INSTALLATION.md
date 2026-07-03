# Version 58.0 — Event Bus & State Engine Refactor

This version addresses the root cause of the remaining right-dock flicker: duplicate event storms.

## 1. Copy files

```powershell
Copy-Item payload\app\static\js\core\event_state_engine_v58.js app\static\js\core\event_state_engine_v58.js -Force
Copy-Item payload\app\static\js\core\state_render_scheduler_v58.js app\static\js\core\state_render_scheduler_v58.js -Force
```

## 2. Add scripts to `_script_loader.html`

Open:

```text
app\templates\workstation\_script_loader.html
```

Add these **immediately after**:

```html
<script src="/static/js/core/event_bus.js"></script>
```

Add:

```html
<script src="/static/js/core/event_state_engine_v58.js"></script>
<script src="/static/js/core/state_render_scheduler_v58.js"></script>
```

Important: these must load early, before scanner, decision, AI, audit, and dock modules.

## 3. Keep V57.1 and V57.2 for now

Leave these at the bottom for now:

```html
<script src="/static/js/system/institutional_event_stabilizer_v57_1.js"></script>
<script src="/static/js/system/right_dock_stability_controller_v57_2.js"></script>
```

After V58 is confirmed stable, we can remove the older stabilizers.

## 4. Restart and hard refresh

```powershell
python -m compileall app
python -c "from app.main import app; print('App import OK')"
```

Then restart Uvicorn and hard refresh Chrome.
