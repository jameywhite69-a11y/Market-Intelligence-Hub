```powershell
git status
git add app docs
git commit -m "Version 90.1 - Fix broker readiness recursion"
git tag -a v90.1 -m "Fix broker readiness recursion"
git push origin chore/release-process
git push origin v90.1
git status
```
