# Installation Guide — Version 42.8

## 1. Copy files

Copy everything inside `payload/` into:

```text
C:\market_intelligence_hub_v24_1A
```

## 2. Add CSS to `base.html`

```html
<link rel="stylesheet" href="/static/css/workspace_persistence_polish.css">
```

## 3. Add panels to `workstation.html`

Add these in the right dock source area:

```html
<section id="workspaceProfilesPanel"></section>
<section id="commercialReadinessPanel"></section>
```

## 4. Add scripts to `workstation.html`

Add after WorkspaceContext scripts:

```html
<script src="/static/js/workspace/workspace_profiles.js"></script>
<script src="/static/js/workspace/workspace_profiles_panel.js"></script>
<script src="/static/js/workspace/professional_status_bar_v42.js"></script>
<script src="/static/js/workspace/commercial_readiness_panel.js"></script>
```

## 5. Update `institutional_dock_system.js`

Recommended:

```javascript
moveIntoDock("workspaceProfilesPanel", "diagnostics");
moveIntoDock("commercialReadinessPanel", "diagnostics");
```
