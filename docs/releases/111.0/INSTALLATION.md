# Version 111.0 — Risk Governance Engine

```powershell
Copy-Item payload\app\static\js\risk\risk_governance_engine_v111.js app\static\js\risk\risk_governance_engine_v111.js -Force
Copy-Item payload\app\static\js\risk\governance_violation_panel_v111.js app\static\js\risk\governance_violation_panel_v111.js -Force
Copy-Item payload\app\static\js\risk\governance_health_panel_v111.js app\static\js\risk\governance_health_panel_v111.js -Force
Copy-Item payload\app\static\css\risk_governance_v111.css app\static\css\risk_governance_v111.css -Force
```

Add CSS:

```html
<link rel="stylesheet" href="/static/css/risk_governance_v111.css">
```

Add placeholders:

```html
<section id="riskGovernanceEnginePanelV111"></section>
<section id="governanceViolationPanelV111"></section>
<section id="governanceHealthPanelV111"></section>
```

Add scripts:

```html
<script src="/static/js/risk/risk_governance_engine_v111.js"></script>
<script src="/static/js/risk/governance_violation_panel_v111.js"></script>
<script src="/static/js/risk/governance_health_panel_v111.js"></script>
```
