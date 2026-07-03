# Version 57.1 — UI Event Stability Hotfix

This fixes:

1. Screen flashing between old/new heatmap layouts after Run Scan.
2. Right dock flicker when clicking opportunity cards.

## 1. Copy the hotfix file

```powershell
New-Item -ItemType Directory -Force app\static\js\system
Copy-Item payload\app\static\js\system\institutional_event_stabilizer_v57_1.js app\static\js\system\institutional_event_stabilizer_v57_1.js -Force
```

## 2. Remove the old V55 heatmap renderer

Open:

```text
app\templates\workstation\_script_loader.html
```

Remove or comment out:

```html
<script src="/static/js/scanner/opportunity_heatmap_terminal_v55.js"></script>
```

## 3. Confirm V56 only writes to its own heatmap

Open:

```text
app\static\js\scanner\institutional_scanner_engine_v56.js
```

Replace:

```javascript
const panel = document.getElementById("institutionalHeatmapV56Panel") || document.getElementById("opportunityHeatmap");
```

with:

```javascript
const panel = document.getElementById("institutionalHeatmapV56Panel");
```

## 4. Add the stabilizer as the LAST script

At the bottom of `_script_loader.html`:

```html
<script src="/static/js/system/institutional_event_stabilizer_v57_1.js"></script>
```

Then restart and hard refresh.
