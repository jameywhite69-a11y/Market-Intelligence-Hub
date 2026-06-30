# Installation Guide — Version 43.3

## 1. Copy Payload

Copy everything from `payload/` into the project root.

## 2. Add CSS to `base.html`

```html
<link rel="stylesheet" href="/static/css/news_catalyst_center.css">
```

## 3. Add Panel to `workstation.html`

```html
<section id="newsCatalystCenterPanel"></section>
```

## 4. Add Script to `workstation.html`

```html
<script src="/static/js/market_intelligence/news_catalyst_center.js"></script>
```

## 5. Update Dock

Add to `institutional_dock_system.js`, preferably AI tab or Diagnostics tab:

```javascript
moveIntoDock("newsCatalystCenterPanel", "ai");
```
