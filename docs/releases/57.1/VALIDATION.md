# Validation

```powershell
python -m compileall app
python -c "from app.main import app; print('App import OK')"

Select-String app\templates\workstation\_script_loader.html -Pattern "opportunity_heatmap_terminal_v55|institutional_event_stabilizer_v57_1"
Select-String app\static\js\scanner\institutional_scanner_engine_v56.js -Pattern "institutionalHeatmapV56Panel|opportunityHeatmap"
```

Browser console:

```javascript
typeof TIOSEventStabilizerV571
document.body.dataset.tiosStabilityHotfix
```

Expected:

```javascript
"object"
"57.1"
```
