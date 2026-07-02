# Rollback

Remove from `base.html`:

```html
<link rel="stylesheet" href="/static/css/tios_layout_manager.css">
```

Remove from `workstation.html`:

```html
<script src="/static/js/layout/tios_panel_registry.js"></script>
<script src="/static/js/layout/tios_layout_manager.js"></script>
<script src="/static/js/layout/tios_layout_manager_panel.js"></script>
<section id="tiosLayoutManagerPanel"></section>
```

No template replacement is needed.
