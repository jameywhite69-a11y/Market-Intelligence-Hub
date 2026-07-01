# Installation Guide — Version 45.0

## 1. Copy payload

Copy everything from `payload/` into the project root.

## 2. Add CSS to `base.html`

```html
<link rel="stylesheet" href="/static/css/unified_intelligence.css">
```

## 3. Add panel to `workstation.html`

Add this near the other diagnostics panels:

```html
<section id="workspaceHealthDashboardPanel"></section>
```

## 4. Add scripts to `workstation.html`

Add these after core services and before panels that depend on selected opportunities:

```html
<script src="/static/js/intelligence/unified_opportunity_store.js"></script>
<script src="/static/js/intelligence/workspace_synchronization_engine.js"></script>
<script src="/static/js/intelligence/event_recorder.js"></script>
<script src="/static/js/intelligence/workspace_health_dashboard.js"></script>
```

## 5. Add to dock map

In `institutional_dock_system.js`, add this to the diagnostics list:

```javascript
"workspaceHealthDashboardPanel"
```
