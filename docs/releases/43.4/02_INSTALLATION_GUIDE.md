# Installation Guide — Version 43.4

## 1. Copy Payload
Copy everything from `payload/` into your project root.

## 2. Register API in `app/main.py`

Add near imports:

```python
from app.api.strategy_registry_api import (
    get_research_strategy,
    list_research_strategies,
    strategy_registry_health,
    router as strategy_registry_router,
)
```

Add near direct routes:

```python
app.add_api_route("/api/research/strategies", list_research_strategies, methods=["GET"])
app.add_api_route("/api/research/strategies/health", strategy_registry_health, methods=["GET"])
app.add_api_route("/api/research/strategies/{strategy_id}", get_research_strategy, methods=["GET"])
```

Add near router includes:

```python
app.include_router(strategy_registry_router)
```

## 3. Add CSS to `base.html`

```html
<link rel="stylesheet" href="/static/css/strategy_registry.css">
```

## 4. Add Panel to `workstation.html`

```html
<section id="strategyRegistryPanel"></section>
```

## 5. Add Scripts to `workstation.html`

```html
<script src="/static/js/research/strategy_registry_client.js"></script>
<script src="/static/js/research/strategy_registry_panel.js"></script>
```

## 6. Update Dock

```javascript
moveIntoDock("strategyRegistryPanel", "ai");
```
