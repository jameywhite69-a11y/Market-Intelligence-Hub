# Validation

```powershell
python -m compileall app
python -c "from app.main import app; print('App import OK')"

Select-String app\templates\base.html -Pattern "multi_account_portfolio_v104.css"
Select-String app\templates\workstation\_center_workspace.html -Pattern "multiAccountRegistryPanelV104|accountAggregationPanelV104|crossAccountPositionsPanelV104|accountAllocationAIPanelV104"
Select-String app\templates\workstation\_script_loader.html -Pattern "multi_account_registry_v104|account_aggregation_engine_v104|cross_account_positions_v104|account_allocation_ai_v104"
```

Browser:
```javascript
typeof MultiAccountRegistryV104
typeof AccountAggregationEngineV104
typeof CrossAccountPositionsV104
typeof AccountAllocationAIV104
MultiAccountRegistryV104.snapshot()
AccountAggregationEngineV104.aggregate()
AccountAllocationAIV104.recommend()
```
