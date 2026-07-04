
# Version 101.0

Copy:

```powershell
Copy-Item payload\app\static\js\ai\ai_strategy_generator_v101.js app\static\js\ai\ai_strategy_generator_v101.js -Force
Copy-Item payload\app\static\css\ai_strategy_generator_v101.css app\static\css\ai_strategy_generator_v101.css -Force
```

base.html

```html
<link rel="stylesheet" href="/static/css/ai_strategy_generator_v101.css">
```

_center_workspace.html

```html
<section id="aiStrategyGeneratorPanelV101"></section>
```

_script_loader.html

```html
<script src="/static/js/ai/ai_strategy_generator_v101.js"></script>
```
