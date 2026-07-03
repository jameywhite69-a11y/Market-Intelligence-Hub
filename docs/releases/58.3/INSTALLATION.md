# Version 58.3 — Opportunity Panel Stability Hotfix

This fixes the remaining flicker inside the AI tab: the **Opportunity Intelligence** panel.

## 1. Copy files

```powershell
Copy-Item payload\app\static\js\ai\opportunity_panel_state_subscriber_v58_3.js app\static\js\ai\opportunity_panel_state_subscriber_v58_3.js -Force
Copy-Item payload\app\static\css\opportunity_panel_stability_v58_3.css app\static\css\opportunity_panel_stability_v58_3.css -Force
```

## 2. Add CSS to `base.html`

```html
<link rel="stylesheet" href="/static/css/opportunity_panel_stability_v58_3.css">
```

## 3. Add JS near the bottom of `_script_loader.html`

Add after the AI dock state subscriber:

```html
<script src="/static/js/ai/opportunity_panel_state_subscriber_v58_3.js"></script>
```

## 4. Important

Leave the old `opportunity_panel.js` loaded for now if other parts of the app need it.  
This V58.3 subscriber takes ownership of the AI dock opportunity panel after load and only renders once per actual state change.

## 5. Test

- Select AI tab.
- Click BTC, ETH, SOL opportunity cards.
- The Opportunity Intelligence card should update once, without flickering.
