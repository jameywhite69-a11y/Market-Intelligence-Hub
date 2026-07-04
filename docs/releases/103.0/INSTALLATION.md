
# Version 103.0

Copy:

```powershell
Copy-Item payload\app\static\js\broker\live_broker_enablement_wizard_v103.js app\static\js\broker\live_broker_enablement_wizard_v103.js -Force
Copy-Item payload\app\static\css\live_broker_enablement_wizard_v103.css app\static\css\live_broker_enablement_wizard_v103.css -Force
```

Add to `base.html`

```html
<link rel="stylesheet" href="/static/css/live_broker_enablement_wizard_v103.css">
```

Add to `_center_workspace.html`

```html
<section id="liveBrokerEnablementWizardPanelV103"></section>
```

Add to `_script_loader.html`

```html
<script src="/static/js/broker/live_broker_enablement_wizard_v103.js"></script>
```
