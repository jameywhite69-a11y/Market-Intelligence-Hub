# Validation

```powershell
python -m compileall app
python -c "from app.main import app; print('App import OK')"

Select-String app\static\js\broker\live_broker_enablement_wizard_v103.js -Pattern "\}\)\(\);"
Select-String app\templates\workstation\_script_loader.html -Pattern "live_broker_enablement_wizard_v103"
```

Browser console:

```javascript
typeof LiveBrokerEnablementWizardV103
LiveBrokerEnablementWizardV103.version
LiveBrokerEnablementWizardV103.render()
```

Expected:

```text
"object"
"103.1"
```
