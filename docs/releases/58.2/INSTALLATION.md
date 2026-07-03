# Version 58.2 — AI Dock State Subscriber

This fixes the issue where Version 58.1 stopped the AI dock flicker but also made the AI dock stale.

## 1. Copy files

```powershell
Copy-Item payload\app\static\js\ai\ai_dock_state_subscriber_v58_2.js app\static\js\ai\ai_dock_state_subscriber_v58_2.js -Force
Copy-Item payload\app\static\css\ai_dock_state_subscriber_v58_2.css app\static\css\ai_dock_state_subscriber_v58_2.css -Force
```

## 2. Add CSS to `base.html`

```html
<link rel="stylesheet" href="/static/css/ai_dock_state_subscriber_v58_2.css">
```

## 3. Disable the old 58.1 freeze script

In:

```text
app\templates\workstation\_script_loader.html
```

Remove or comment out:

```html
<script src="/static/js/system/ai_dock_stability_controller_v58_1.js"></script>
```

## 4. Add the new subscriber script near the bottom

Add this as one of the final scripts, after V58 Event State Engine and after decision modules:

```html
<script src="/static/js/ai/ai_dock_state_subscriber_v58_2.js"></script>
```

## 5. Restart and hard refresh

Then test:

- Select AI tab.
- Click BTC, ETH, SOL opportunity cards.
- The AI dock should update once per selection with no flicker.
