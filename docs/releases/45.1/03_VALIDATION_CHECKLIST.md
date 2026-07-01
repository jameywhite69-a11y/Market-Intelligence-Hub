# Validation Checklist — Version 45.1

```powershell
python -m compileall app
python -m pytest tests
python -c "from app.main import app; print('App import OK')"
Select-String app\templates\workstation.html -Pattern "extends|block content|block scripts|unified_opportunity_store|scanner_selection_unifier|data-dock-tab"
```

Browser console:

```javascript
typeof UnifiedOpportunityStore
typeof ScannerSelectionUnifier
typeof InstitutionalDockSystem
```

Each should return `"object"`.
