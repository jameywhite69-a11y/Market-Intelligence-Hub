# Validation Checklist — Version 48.1

```powershell
python -m compileall app
python -m pytest tests
python -c "from app.main import app; print('App import OK')"
Select-String app\templates\base.html -Pattern "professional_decision_workspace.css"
Select-String app\templates\workstation.html -Pattern "workstation-decision-zone|decisionPipelinePanel|institutionalDecisionPackagePanel"
```

Browser:
1. Open `/workstation?layout=481`.
2. Run scan.
3. Click an opportunity.
4. Confirm Decision Intelligence is in the center.
5. Confirm only the Decision Intelligence card scrolls internally.
