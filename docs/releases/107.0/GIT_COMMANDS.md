```powershell
git status
git add app docs
git commit -m "Version 107.0 - Institutional Alert Center"
git tag -a v107.0 -m "Institutional Alert Center"
git push origin chore/release-process
git push origin v107.0
git status
```
