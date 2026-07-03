# Version 68.0 - AI Trade Review & Coaching

Copy:

```powershell
Copy-Item payload\app\static\js\ai\ai_trade_review_engine_v68.js app\static\js\ai\ai_trade_review_engine_v68.js -Force
Copy-Item payload\app\static\css\ai_trade_review_v68.css app\static\css\ai_trade_review_v68.css -Force
```

Add to `base.html`:

```html
<link rel="stylesheet" href="/static/css/ai_trade_review_v68.css">
```

Add to `_center_workspace.html`:

```html
<section id="aiTradeReviewPanelV68"></section>
```

Add to `_script_loader.html`:

```html
<script src="/static/js/ai/ai_trade_review_engine_v68.js"></script>
```
