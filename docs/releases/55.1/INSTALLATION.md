# Version 55.1 — Annotated Workstation Template

This release does not change application behavior. It only adds clear section headers and descriptions to `workstation_v53.html`.

## Install

```powershell
Copy-Item app\templates\workstation_v53.html app\templates\workstation_v53.pre55_1.backup.html -Force
Copy-Item payload\app\templates\workstation_v53.html app\templates\workstation_v53.html -Force
```

## Verify

```powershell
python -m compileall app
python -c "from app.main import app; print('App import OK')"
Select-String app\templates\workstation_v53.html -Pattern "TIOS NATIVE WORKSTATION|LEFT SIDEBAR|CENTER WORKSPACE|RIGHT INSTITUTIONAL DOCK|JAVASCRIPT MODULE LOAD ORDER"
```
