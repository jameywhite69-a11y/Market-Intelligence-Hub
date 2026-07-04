# Version 99.0

Copy:

```powershell
Copy-Item payload\app\static\js\strategy\strategy_sdk_v99.js app\static\js\strategy\strategy_sdk_v99.js -Force
Copy-Item payload\app\static\js\strategy\visual_strategy_builder_v99.js app\static\js\strategy\visual_strategy_builder_v99.js -Force
Copy-Item payload\app\static\js\strategy\strategy_manager_v99.js app\static\js\strategy\strategy_manager_v99.js -Force
Copy-Item payload\app\static\css\strategy_sdk_v99.css app\static\css\strategy_sdk_v99.css -Force
```

base.html:
```html
<link rel="stylesheet" href="/static/css/strategy_sdk_v99.css">
```

_center_workspace.html:
```html
<section id="visualStrategyBuilderPanelV99"></section>
<section id="strategyManagerPanelV99"></section>
```

_script_loader.html:
```html
<script src="/static/js/strategy/strategy_sdk_v99.js"></script>
<script src="/static/js/strategy/visual_strategy_builder_v99.js"></script>
<script src="/static/js/strategy/strategy_manager_v99.js"></script>
```
