# Rollback — Version 43.0

Remove:

- `app/static/js/command/command_center_store.js`
- `app/static/js/command/command_center_orchestrator.js`
- `app/static/js/command/command_center_panel.js`
- `app/static/css/command_center.css`

Then remove the CSS link, script tags, panel section, and dock movement line.

If committed:

```powershell
git revert HEAD
```
