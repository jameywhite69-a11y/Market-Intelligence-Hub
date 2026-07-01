# Rollback

Remove the CSS link, script tags, panel section, and delete:

- `app/static/js/intelligence/`
- `app/static/css/unified_intelligence.css`

If committed:

```powershell
git revert HEAD
```
