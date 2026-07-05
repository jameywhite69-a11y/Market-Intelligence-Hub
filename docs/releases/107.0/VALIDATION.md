# Validation

```powershell
python -m compileall app
python -c "from app.main import app; print('App import OK')"

Select-String app\templates\base.html -Pattern "institutional_alert_center_v107.css"
Select-String app\templates\workstation\_center_workspace.html -Pattern "institutionalAlertCenterPanelV107|alertRuleManagerPanelV107|alertDeliveryLogPanelV107|alertHealthPanelV107"
Select-String app\templates\workstation\_script_loader.html -Pattern "institutional_alert_center_v107|alert_rule_manager_v107|alert_delivery_log_v107|alert_health_panel_v107"
```

Browser:

```javascript
typeof InstitutionalAlertCenterV107
typeof AlertRuleManagerV107
typeof AlertDeliveryLogV107
typeof AlertHealthPanelV107
InstitutionalAlertCenterV107.pushAlert("test","Test Alert","Manual test alert")
InstitutionalAlertCenterV107.snapshot()
AlertHealthPanelV107.check()
```
