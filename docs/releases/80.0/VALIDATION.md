# Validation

```powershell
python -m compileall app
python -c "from app.main import app; print('App import OK')"
Select-String app\templates\base.html -Pattern "paper_trading_engine_v80.css"
Select-String app\templates\workstation\_center_workspace.html -Pattern "paperTradingAccountPanelV80|paperOrderTicketPanelV80|paperPositionsPanelV80"
Select-String app\templates\workstation\_script_loader.html -Pattern "paper_trading_account_v80|paper_order_ticket_v80|paper_positions_panel_v80"
```

Browser console:

```javascript
typeof PaperTradingAccountV80
typeof PaperOrderTicketV80
typeof PaperPositionsPanelV80
RealtimeDataBusV74.start()
PaperTradingAccountV80.stageOrder()
PaperTradingAccountV80.submitOrder()
PaperTradingAccountV80.snapshot()
```
