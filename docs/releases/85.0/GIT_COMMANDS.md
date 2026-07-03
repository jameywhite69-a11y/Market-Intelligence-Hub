```powershell
git status
git add app docs
git commit -m "Version 85.0 - Streaming Market Data Bus"
git tag -a v85.0 -m "Streaming Market Data Bus"
git push origin chore/release-process
git push origin v85.0
git status
```
