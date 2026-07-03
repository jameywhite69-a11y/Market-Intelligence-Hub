# Validation

```powershell
python -m compileall app
python -c "from app.main import app; print('App import OK')"
Select-String app\templates\base.html -Pattern "opportunity_panel_stability_v58_3.css"
Select-String app\templates\workstation\_script_loader.html -Pattern "opportunity_panel_state_subscriber_v58_3"
```

Browser console:

```javascript
typeof OpportunityPanelStateSubscriberV583
document.body.dataset.opportunityPanelStability
document.getElementById("opportunityPanel")?.dataset.opportunityStable
```

Expected:

```javascript
"object"
"58.3"
"58.3"
```
