# Installation Guide — Version 43.0

## 1. Copy Payload

Copy everything from `payload/` into your project root:

```text
C:\market_intelligence_hub_v24_1A
```

## 2. Add CSS to `base.html`

```html
<link rel="stylesheet" href="/static/css/command_center.css">
```

## 3. Add Panel to `workstation.html`

Add this in the right dock source area:

```html
<section id="institutionalCommandCenterPanel"></section>
```

## 4. Add Scripts to `workstation.html`

Add after WorkspaceContext, AI, Risk, Portfolio, Automation, and Timeline scripts:

```html
<script src="/static/js/command/command_center_store.js"></script>
<script src="/static/js/command/command_center_orchestrator.js"></script>
<script src="/static/js/command/command_center_panel.js"></script>
```

## 5. Update `institutional_dock_system.js`

Recommended placement: Execution tab near the top.

```javascript
moveIntoDock("institutionalCommandCenterPanel", "execution");
```
