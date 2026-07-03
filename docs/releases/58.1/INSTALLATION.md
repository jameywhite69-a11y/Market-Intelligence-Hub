# Version 58.1 — AI Dock Stability Hotfix

Your observation is correct: the flicker only happening on the **AI** tab means the remaining issue is inside the AI/audit dock, not the whole workstation.

## 1. Copy files

```powershell
Copy-Item payload\app\static\js\system\ai_dock_stability_controller_v58_1.js app\static\js\system\ai_dock_stability_controller_v58_1.js -Force
Copy-Item payload\app\static\css\ai_dock_stability_v58_1.css app\static\css\ai_dock_stability_v58_1.css -Force
```

## 2. Add CSS to `base.html`

```html
<link rel="stylesheet" href="/static/css/ai_dock_stability_v58_1.css">
```

## 3. Add JS as the last script in `_script_loader.html`

At the very bottom:

```html
<script src="/static/js/system/ai_dock_stability_controller_v58_1.js"></script>
```

## 4. Restart and hard refresh

Then test:

- Execution tab selected: click opportunities.
- Positions tab selected: click opportunities.
- AI tab selected: click opportunities.

The AI tab should no longer rapidly flicker/repaint.
