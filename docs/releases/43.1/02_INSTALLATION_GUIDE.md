# Installation Guide — Version 43.1

## 1. Copy Payload

Copy everything from `payload/` into the project root.

## 2. Add CSS to `base.html`

```html
<link rel="stylesheet" href="/static/css/trade_journal.css">
```

## 3. Add Panel to `workstation.html`

```html
<section id="tradeJournalPanel"></section>
```

## 4. Add Scripts to `workstation.html`

```html
<script src="/static/js/journal/trade_journal_store.js"></script>
<script src="/static/js/journal/performance_analytics.js"></script>
<script src="/static/js/journal/trade_journal_panel.js"></script>
```

## 5. Update Dock

Add to `institutional_dock_system.js`, preferably Diagnostics or Positions tab:

```javascript
moveIntoDock("tradeJournalPanel", "diagnostics");
```
