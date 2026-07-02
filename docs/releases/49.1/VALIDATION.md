# Validation

```powershell
python -m compileall app
python -m pytest tests
python -c "from app.main import app; print('App import OK')"
Select-String app\templates\base.html -Pattern "tios_professional_layout.css"
Select-String app\static\js\workstation\institutional_dock_system.js -Pattern "decisionPipelinePanel|institutionalDecisionPackagePanel|decisionStagePipelinePanel"
```

Expected last command: no output.

Open:

```text
http://127.0.0.1:8000/workstation?layout=491
```

Hard refresh with Ctrl+F5.
