# Version 100.0

Copy JS and CSS into app/static.

Add to base.html:

```html
<link rel="stylesheet" href="/static/css/strategy_marketplace_v100.css">
```

Add to _center_workspace.html:

```html
<section id="strategyMarketplacePanelV100"></section>
<section id="packageManagerPanelV100"></section>
```

Add to _script_loader.html:

```html
<script src="/static/js/strategy/strategy_marketplace_v100.js"></script>
<script src="/static/js/strategy/package_manager_v100.js"></script>
```

Validation:

```powershell
python -m compileall app
python -c "from app.main import app; print('App import OK')"
```
