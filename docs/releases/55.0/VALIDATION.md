# Validation

```powershell
python -m compileall app
python -c "from app.main import app; print('App import OK')"
Select-String app\templates\base.html -Pattern "institutional_terminal_v55.css"
Select-String app\templates\workstation\_center_workspace.html -Pattern "institutionalPackageReportPanel"
Select-String app\templates\workstation\_script_loader.html -Pattern "ai_trading_commander_terminal_v55|institutional_package_terminal_v55|opportunity_heatmap_terminal_v55"
```

Browser console:

```javascript
typeof AITradingCommanderTerminalV55
typeof InstitutionalPackageTerminalV55
typeof OpportunityHeatmapTerminalV55
```
