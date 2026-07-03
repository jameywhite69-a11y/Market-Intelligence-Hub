# Version 75.0 — Core Event Bus Refactor

## 1. Copy files

```powershell
Copy-Item payload\app\static\js\core\core_event_dispatcher_v75.js app\static\js\core\core_event_dispatcher_v75.js -Force
Copy-Item payload\app\static\js\core\canonical_state_viewer_v75.js app\static\js\core\canonical_state_viewer_v75.js -Force
Copy-Item payload\app\static\js\core\event_pipeline_health_v75.js app\static\js\core\event_pipeline_health_v75.js -Force
Copy-Item payload\app\static\css\core_event_dispatcher_v75.css app\static\css\core_event_dispatcher_v75.css -Force
```

## 2. Add CSS to `base.html`

```html
<link rel="stylesheet" href="/static/css/core_event_dispatcher_v75.css">
```

## 3. Add placeholders to `_center_workspace.html`

Inside `.native-decision-grid`:

```html
<section id="coreEventDispatcherPanelV75"></section>
<section id="canonicalStateViewerPanelV75"></section>
<section id="eventPipelineHealthPanelV75"></section>
```

## 4. Add scripts to `_script_loader.html`

Add immediately after `event_state_engine_v58.js` and `state_render_scheduler_v58.js`:

```html
<script src="/static/js/core/core_event_dispatcher_v75.js"></script>
<script src="/static/js/core/canonical_state_viewer_v75.js"></script>
<script src="/static/js/core/event_pipeline_health_v75.js"></script>
```
