# Installation

Copy payload into project root.

Add to `base.html`:
```html
<link rel="stylesheet" href="/static/css/decision_engine.css">
```

Add to `workstation.html` AI/right dock group:
```html
<section id="decisionPipelinePanel"></section>
```

Add after v45 intelligence scripts:
```html
<script src="/static/js/decision/decision_engine.js"></script>
<script src="/static/js/decision/decision_pipeline_panel.js"></script>
<script src="/static/js/decision/decision_timeline.js"></script>
```

In `institutional_dock_system.js`, add `"decisionPipelinePanel"` to the `ai` list.
