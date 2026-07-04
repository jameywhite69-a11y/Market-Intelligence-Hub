# Version 106.0 — Advanced AI Trade Coach

```powershell
Copy-Item payload\app\static\js\ai\ai_trade_coach_v106.js app\static\js\ai\ai_trade_coach_v106.js -Force
Copy-Item payload\app\static\js\ai\trading_mistake_detector_v106.js app\static\js\ai\trading_mistake_detector_v106.js -Force
Copy-Item payload\app\static\js\ai\coach_action_plan_v106.js app\static\js\ai\coach_action_plan_v106.js -Force
Copy-Item payload\app\static\css\ai_trade_coach_v106.css app\static\css\ai_trade_coach_v106.css -Force
```

Add CSS:

```html
<link rel="stylesheet" href="/static/css/ai_trade_coach_v106.css">
```

Add placeholders:

```html
<section id="aiTradeCoachPanelV106"></section>
<section id="tradingMistakeDetectorPanelV106"></section>
<section id="coachActionPlanPanelV106"></section>
```

Add scripts:

```html
<script src="/static/js/ai/ai_trade_coach_v106.js"></script>
<script src="/static/js/ai/trading_mistake_detector_v106.js"></script>
<script src="/static/js/ai/coach_action_plan_v106.js"></script>
```
