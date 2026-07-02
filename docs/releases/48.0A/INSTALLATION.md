# Version 48.0A — Center Decision Zone

## 1. CSS

Copy:

```text
payload/app/static/css/workstation_decision_zone.css
```

to:

```text
app/static/css/workstation_decision_zone.css
```

Add to `base.html`:

```html
<link rel="stylesheet" href="/static/css/workstation_decision_zone.css">
```

## 2. Center workspace

In `workstation.html`, insert `snippets/workstation_center_decision_zone.html` after:

```html
<section class="workstation-mini-panels">
```

and before:

```html
<section class="desk-panel workstation-results-panel">
```

## 3. Right AI tab

Replace the right-dock AI region with `snippets/workstation_right_ai_region.html`.

## 4. Dock map

Replace the `ai:` list in `institutional_dock_system.js` with `snippets/institutional_dock_ai_map.js`.
