# Version 82.0 — AI Trading Assistant

## 1. Copy files

```powershell
Copy-Item payload\app\static\js\ai\ai_trading_assistant_v82.js app\static\js\ai\ai_trading_assistant_v82.js -Force
Copy-Item payload\app\static\js\ai\ai_trade_guidance_panel_v82.js app\static\js\ai\ai_trade_guidance_panel_v82.js -Force
Copy-Item payload\app\static\js\ai\ai_assistant_health_v82.js app\static\js\ai\ai_assistant_health_v82.js -Force
Copy-Item payload\app\static\css\ai_trading_assistant_v82.css app\static\css\ai_trading_assistant_v82.css -Force
```

## 2. Add CSS to `base.html`

```html
<link rel="stylesheet" href="/static/css/ai_trading_assistant_v82.css">
```

## 3. Add placeholders to `_center_workspace.html`

Inside `.native-decision-grid`, after V81 position/risk panels or near AI Commander:

```html
<section id="aiTradingAssistantPanelV82"></section>
<section id="aiTradeGuidancePanelV82"></section>
<section id="aiAssistantHealthPanelV82"></section>
```

## 4. Add scripts to `_script_loader.html`

Add after V81 position/risk scripts and after existing AI commander modules:

```html
<script src="/static/js/ai/ai_trading_assistant_v82.js"></script>
<script src="/static/js/ai/ai_trade_guidance_panel_v82.js"></script>
<script src="/static/js/ai/ai_assistant_health_v82.js"></script>
```
