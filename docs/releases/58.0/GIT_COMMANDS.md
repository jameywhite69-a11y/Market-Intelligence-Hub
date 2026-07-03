```powershell
git status
git add app docs
git commit -m "Version 58.0 - Event Bus and State Engine Refactor"
git tag -a v58.0 -m "Event Bus and State Engine Refactor"
git push origin chore/release-process
git push origin v58.0
git status
```
