# Installation Guide — Version 44.0

## Back up

```powershell
Copy-Item app\static\js\workstation\institutional_dock_system.js app\static\js\workstation\institutional_dock_system.backup.js
Copy-Item app\static\css\institutional_dock_system.css app\static\css\institutional_dock_system.backup.css
Copy-Item app\templates\workstation.html app\templates\workstation.backup.html
```

## Copy payload

Copy everything from `payload/` into your project root.

## Confirm CSS cache-busting in `base.html`

```html
<link rel="stylesheet" href="/static/css/institutional_dock_system.css?v=4400">
```

## Confirm scripts in `workstation.html`

Add near the end of the scripts block:

```html
<script src="/static/js/workstation/platform_asset_validator.js"></script>
<script src="/static/js/workstation/institutional_dock_system.js"></script>
```

`platform_asset_validator.js` should load before `institutional_dock_system.js`.
