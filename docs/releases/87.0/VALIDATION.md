```powershell
python -m compileall app
python -c "from app.main import app; print('App import OK')"
Select-String app\templates\base.html -Pattern "institutional_chart_workspace_v87.css"
Select-String app\templates\workstation\_center_workspace.html -Pattern "institutionalChartWorkspacePanelV87|chartOverlayEnginePanelV87|chartWorkspaceHealthPanelV87"
Select-String app\templates\workstation\_script_loader.html -Pattern "institutional_chart_workspace_v87|chart_overlay_engine_v87|chart_workspace_health_v87"
```

Browser:

```javascript
typeof InstitutionalChartWorkspaceV87
typeof ChartOverlayEngineV87
typeof ChartWorkspaceHealthV87
StreamingMarketDataBusV85.start()
InstitutionalChartWorkspaceV87.state()
```
