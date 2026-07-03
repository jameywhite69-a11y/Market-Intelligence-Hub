```powershell
git status
git add app docs
git commit -m "Version 70.0 - Release Candidate Hardening"
git tag -a v70.0 -m "Release Candidate Hardening"
git push origin chore/release-process
git push origin v70.0
git status
```
