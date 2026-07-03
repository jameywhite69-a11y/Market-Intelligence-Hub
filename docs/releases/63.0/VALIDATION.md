# Validation

```powershell
python -m compileall app
python -c "from app.main import app; print('App import OK')"
Select-String app\templates\base.html -Pattern "context_store_architecture_v63.css"
Select-String app\templates\workstation\_center_workspace.html -Pattern "contextOverviewPanelV63"
Select-String app\templates\workstation\_script_loader.html -Pattern "market_context_store_v63|selection_coordinator_v63|workspace_render_scheduler_v63|context_overview_panel_v63"
```

Browser console:

```javascript
typeof MarketContextStoreV63
typeof SelectionCoordinatorV63
typeof WorkspaceRenderSchedulerV63
typeof ContextOverviewPanelV63
MarketContextStoreV63.snapshot()
```
