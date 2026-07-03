# Validation

```powershell
python -m compileall app
python -c "from app.main import app; print('App import OK')"
Select-String app\templates\base.html -Pattern "ai_trading_assistant_v82.css"
Select-String app\templates\workstation\_center_workspace.html -Pattern "aiTradingAssistantPanelV82|aiTradeGuidancePanelV82|aiAssistantHealthPanelV82"
Select-String app\templates\workstation\_script_loader.html -Pattern "ai_trading_assistant_v82|ai_trade_guidance_panel_v82|ai_assistant_health_v82"
```

Browser console:

```javascript
typeof AITradingAssistantV82
typeof AITradeGuidancePanelV82
typeof AIAssistantHealthV82
AITradingAssistantV82.recommendation()
```
