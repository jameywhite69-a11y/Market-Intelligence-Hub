```powershell
git status
git add app docs
git commit -m "Version 75.0 - Core Event Bus Refactor"
git tag -a v75.0 -m "Core Event Bus Refactor"
git push origin chore/release-process
git push origin v75.0
git status
```
