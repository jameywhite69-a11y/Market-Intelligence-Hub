# Version 104.0 — Multi-Account Portfolio Manager

```powershell
Copy-Item payload\app\static\js\portfolio\multi_account_registry_v104.js app\static\js\portfolio\multi_account_registry_v104.js -Force
Copy-Item payload\app\static\js\portfolio\account_aggregation_engine_v104.js app\static\js\portfolio\account_aggregation_engine_v104.js -Force
Copy-Item payload\app\static\js\portfolio\cross_account_positions_v104.js app\static\js\portfolio\cross_account_positions_v104.js -Force
Copy-Item payload\app\static\js\portfolio\account_allocation_ai_v104.js app\static\js\portfolio\account_allocation_ai_v104.js -Force
Copy-Item payload\app\static\css\multi_account_portfolio_v104.css app\static\css\multi_account_portfolio_v104.css -Force
```

Add CSS:
```html
<link rel="stylesheet" href="/static/css/multi_account_portfolio_v104.css">
```

Add placeholders:
```html
<section id="multiAccountRegistryPanelV104"></section>
<section id="accountAggregationPanelV104"></section>
<section id="crossAccountPositionsPanelV104"></section>
<section id="accountAllocationAIPanelV104"></section>
```

Add scripts:
```html
<script src="/static/js/portfolio/multi_account_registry_v104.js"></script>
<script src="/static/js/portfolio/account_aggregation_engine_v104.js"></script>
<script src="/static/js/portfolio/cross_account_positions_v104.js"></script>
<script src="/static/js/portfolio/account_allocation_ai_v104.js"></script>
```
