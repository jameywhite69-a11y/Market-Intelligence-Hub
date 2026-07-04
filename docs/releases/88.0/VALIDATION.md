# Validation

```powershell
python -m compileall app
python -c "from app.main import app; print('App import OK')"
Select-String app\templates\base.html -Pattern "professional_oms_v88.css"
Select-String app\templates\workstation\_center_workspace.html -Pattern "orderManagementSystemPanelV88|orderBookPanelV88|executionQueuePanelV88|executionAuditPanelV88|omsHealthPanelV88"
Select-String app\templates\workstation\_script_loader.html -Pattern "order_management_system_v88|order_book_panel_v88|execution_queue_panel_v88|execution_audit_panel_v88|oms_health_panel_v88"
```

Browser:

```javascript
typeof OrderManagementSystemV88
typeof OrderBookPanelV88
typeof ExecutionQueuePanelV88
typeof ExecutionAuditPanelV88
typeof OMSHealthPanelV88
OrderManagementSystemV88.createOrderFromOpportunity()
OrderManagementSystemV88.snapshot()
```
