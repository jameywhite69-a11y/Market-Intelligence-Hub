# Rollback Instructions — Version 42.8

Remove:

- `app/static/js/workspace/workspace_profiles.js`
- `app/static/js/workspace/workspace_profiles_panel.js`
- `app/static/js/workspace/professional_status_bar_v42.js`
- `app/static/js/workspace/commercial_readiness_panel.js`
- `app/static/css/workspace_persistence_polish.css`

Then remove matching CSS link, script tags, panel sections, and dock movement lines.

If committed:

```powershell
git revert HEAD
```
