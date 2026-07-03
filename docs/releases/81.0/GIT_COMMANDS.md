```powershell
git status
git add app docs
git commit -m "Version 81.0 - Position and Risk Manager"
git tag -a v81.0 -m "Position and Risk Manager"
git push origin chore/release-process
git push origin v81.0
git status
```
