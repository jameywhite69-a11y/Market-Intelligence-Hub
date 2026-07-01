# Rollback

```powershell
Copy-Item app\static\js\workstation\institutional_dock_system.backup.js app\static\js\workstation\institutional_dock_system.js -Force
Copy-Item app\static\css\institutional_dock_system.backup.css app\static\css\institutional_dock_system.css -Force
Copy-Item app\templates\workstation.backup.html app\templates\workstation.html -Force
```
