```powershell
git status
git add app docs
git commit -m "Version 85.1 - Platform Reorganization"
git tag -a v85.1 -m "Platform Reorganization"
git push origin chore/release-process
git push origin v85.1
git status
```
