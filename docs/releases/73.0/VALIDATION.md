# Validation

```powershell
python -m compileall app
python -c "from app.main import app; print('App import OK')"
Select-String app\templates\base.html -Pattern "unified_settings_v73.css"
Select-String app\templates\workstation\_center_workspace.html -Pattern "unifiedSettingsPanelV73|settingsHealthPanelV73"
Select-String app\templates\workstation\_script_loader.html -Pattern "unified_settings_store_v73|settings_health_panel_v73"
```

Browser console:

```javascript
typeof UnifiedSettingsStoreV73
typeof SettingsHealthPanelV73
UnifiedSettingsStoreV73.load()
```
