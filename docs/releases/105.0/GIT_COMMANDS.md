```powershell
git status
git add app docs
git commit -m "Version 105.0 - Institutional Analytics Suite"
git tag -a v105.0 -m "Institutional Analytics Suite"
git push origin chore/release-process
git push origin v105.0
git status
```
