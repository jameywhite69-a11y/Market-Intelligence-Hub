```powershell
git status
git add app docs
git commit -m "Version 86.0 - Module Manifest Loader"
git tag -a v86.0 -m "Module Manifest Loader"
git push origin chore/release-process
git push origin v86.0
git status
```
