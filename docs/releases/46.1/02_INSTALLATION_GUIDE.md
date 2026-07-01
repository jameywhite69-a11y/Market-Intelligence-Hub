# Installation Guide — Version 46.1

## 1. Copy Payload

Copy everything from `payload/` into the project root.

## 2. Add CSS to `base.html`

```html
<link rel="stylesheet" href="/static/css/decision_pipeline_foundation.css">
```

## 3. Add panels to `workstation.html`

Recommended AI group:

```html
<section id="institutionalDecisionCardPanel"></section>
<section id="decisionPipelineMonitorPanel"></section>
<section id="decisionObjectInspectorPanel"></section>
<section id="decisionAuditTrailPanel"></section>
```

## 4. Add scripts to `workstation.html`

Add after v46 decision scripts:

```html
<script src="/static/js/decision/institutional_decision_card.js"></script>
<script src="/static/js/decision/decision_pipeline_monitor.js"></script>
<script src="/static/js/decision/decision_pipeline_monitor_panel.js"></script>
<script src="/static/js/decision/decision_object_inspector.js"></script>
<script src="/static/js/decision/decision_audit_trail.js"></script>
<script src="/static/js/decision/decision_audit_panel.js"></script>
```

## 5. Update dock map

Add these to the `ai` dock list in `institutional_dock_system.js`:

```javascript
"institutionalDecisionCardPanel",
"decisionPipelineMonitorPanel",
"decisionObjectInspectorPanel",
"decisionAuditTrailPanel"
```
