# Validation

```powershell
python -m compileall app
python -c "from app.main import app; print('App import OK')"

Select-String app\templates\base.html -Pattern "ai_trade_coach_v106.css"
Select-String app\templates\workstation\_center_workspace.html -Pattern "aiTradeCoachPanelV106|tradingMistakeDetectorPanelV106|coachActionPlanPanelV106"
Select-String app\templates\workstation\_script_loader.html -Pattern "ai_trade_coach_v106|trading_mistake_detector_v106|coach_action_plan_v106"
```

Browser:

```javascript
typeof AITradeCoachV106
typeof TradingMistakeDetectorV106
typeof CoachActionPlanV106
AITradeCoachV106.coach()
TradingMistakeDetectorV106.detect()
CoachActionPlanV106.plan()
```
