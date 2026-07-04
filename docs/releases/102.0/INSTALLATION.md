
# Version 102.0

Copy:

```powershell
Copy-Item payload\app\static\js\portfolio\portfolio_optimizer_ai_v102.js app\static\js\portfolio\portfolio_optimizer_ai_v102.js -Force
Copy-Item payload\app\static\css\portfolio_optimizer_ai_v102.css app\static\css\portfolio_optimizer_ai_v102.css -Force
```

Add to `base.html`:

```html
<link rel="stylesheet" href="/static/css/portfolio_optimizer_ai_v102.css">
```

Add to `_center_workspace.html`:

```html
<section id="portfolioOptimizerPanelV102"></section>
```

Add to `_script_loader.html`:

```html
<script src="/static/js/portfolio/portfolio_optimizer_ai_v102.js"></script>
```
