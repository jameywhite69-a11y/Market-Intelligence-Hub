```powershell
git status
git add app docs
git commit -m "Version 108.0 - Production Broker Integration Framework"
git tag -a v108.0 -m "Production Broker Integration Framework"
git push origin chore/release-process
git push origin v108.0
git status
```
