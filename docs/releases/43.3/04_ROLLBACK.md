# Rollback

Remove:

- `app/static/js/market_intelligence/news_catalyst_center.js`
- `app/static/css/news_catalyst_center.css`

Then remove the CSS link, script tag, panel section, and dock movement line.

If committed:

```powershell
git revert HEAD
```
