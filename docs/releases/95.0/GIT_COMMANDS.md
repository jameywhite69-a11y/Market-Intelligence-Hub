```powershell
git status
git add app docs
git commit -m "Version 95.0 - Production Readiness Live Enablement Gate"
git tag -a v95.0 -m "Production Readiness Live Enablement Gate"
git push origin chore/release-process
git push origin v95.0
git status
```
