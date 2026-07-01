# Validation Checklist — Version 43.4.1

```powershell
python -m compileall app
python -m pytest tests
python -c "from app.main import app; print('App import OK')"
Select-String app\templates\workstation.html -Pattern "activityTimelinePanel|brokerAdapterPanel|institutionalOrderTicket|paperTradingPanel|data-dock-tab|data-dock-panel"
```

Manual:
1. Open `/workstation`.
2. Hard refresh with `Ctrl + F5`.
3. Click Execution, Positions, AI, Diagnostics.
4. Run scan and click a result.
