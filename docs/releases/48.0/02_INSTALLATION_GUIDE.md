# Installation Guide — Version 48.0

## 1. Copy Payload

Copy everything from `payload/` into the project root.

## 2. Add CSS to `base.html`

```html
<link rel="stylesheet" href="/static/css/institutional_decision_intelligence.css">
```

## 3. Add panels to `workstation.html`

Add in the AI/Institutional region:

```html
<section id="institutionalDecisionPackagePanel"></section>
<section id="decisionStagePipelinePanel"></section>
<section id="institutionalDecisionAuditPanelV48"></section>
```

## 4. Add scripts to `workstation.html`

Add after v47 institutional scripts:

```html
<script src="/static/js/institutional/institutional_decision_package.js"></script>
<script src="/static/js/institutional/institutional_decision_package_panel.js"></script>
<script src="/static/js/institutional/decision_stage_pipeline.js"></script>
<script src="/static/js/institutional/decision_stage_pipeline_panel.js"></script>
<script src="/static/js/institutional/institutional_decision_audit_v48.js"></script>
<script src="/static/js/institutional/institutional_decision_audit_panel_v48.js"></script>
```

## 5. Update dock map

Add to the `ai` list in `institutional_dock_system.js`:

```javascript
"institutionalDecisionPackagePanel",
"decisionStagePipelinePanel",
"institutionalDecisionAuditPanelV48"
```
