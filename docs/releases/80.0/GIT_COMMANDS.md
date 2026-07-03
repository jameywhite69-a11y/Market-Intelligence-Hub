```powershell
git status
git add app docs
git commit -m "Version 80.0 - Institutional Paper Trading Engine"
git tag -a v80.0 -m "Institutional Paper Trading Engine"
git push origin chore/release-process
git push origin v80.0
git status
```
