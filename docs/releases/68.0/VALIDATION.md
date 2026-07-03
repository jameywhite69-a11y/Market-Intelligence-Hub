```powershell
python -m compileall app
python -c "from app.main import app; print('App import OK')"
Select-String app\templates\base.html -Pattern "ai_trade_review_v68.css"
Select-String app\templates\workstation\_center_workspace.html -Pattern "aiTradeReviewPanelV68"
Select-String app\templates\workstation\_script_loader.html -Pattern "ai_trade_review_engine_v68"
```

Browser:

```javascript
typeof AITradeReviewEngineV68
AITradeReviewEngineV68.reviews()
```
