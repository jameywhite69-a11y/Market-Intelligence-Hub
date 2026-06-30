# Installation

1. Copy `payload/` into project root.

2. Add to `base.html`:

```html
<link rel="stylesheet" href="/static/css/broker_manager.css">
```

3. Add to `workstation.html`:

```html
<section id="brokerManagerPanel"></section>

<script src="/static/js/broker/broker_manager_panel.js"></script>
```

4. In `institutional_dock_system.js`:

```javascript
moveIntoDock("brokerManagerPanel","execution");
```
