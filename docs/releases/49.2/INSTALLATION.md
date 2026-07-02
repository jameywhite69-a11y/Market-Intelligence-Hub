# Version 49.2 — Runtime Layout Composer

This release does not replace `workstation.html`. It preserves the existing template, lets modules initialize normally, then moves rendered panels into a professional layout.

## 1. Copy files

```powershell
Copy-Item payload\app\static\js\workstation\runtime_layout_composer.js app\static\js\workstation\runtime_layout_composer.js -Force
Copy-Item payload\app\static\css\runtime_layout_composer.css app\static\css\runtime_layout_composer.css -Force
```

## 2. Add CSS to `base.html`

Add with other CSS links:

```html
<link rel="stylesheet" href="/static/css/runtime_layout_composer.css">
```

## 3. Add JS to `workstation.html`

Add this as the very last script, after `institutional_dock_system.js`:

```html
<script src="/static/js/workstation/runtime_layout_composer.js"></script>
```

## 4. Do not replace workstation.html

Keep your current working `workstation.html`.
