```powershell
git status
git add app docs
git commit -m "Version 60.0 - Execution Workflow Engine"
git tag -a v60.0 -m "Execution Workflow Engine"
git push origin chore/release-process
git push origin v60.0
git status
```
