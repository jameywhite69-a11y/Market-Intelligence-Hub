```powershell
git status
git add app docs
git commit -m "Version 103.1 - Fix live broker wizard syntax"
git tag -a v103.1 -m "Fix live broker wizard syntax"
git push origin chore/release-process
git push origin v103.1
git status
```
