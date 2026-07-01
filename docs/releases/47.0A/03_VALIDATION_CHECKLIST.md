# Validation Checklist — Version 47.0A

```powershell
python -m compileall app
python -m pytest tests
python -c "from app.main import app; print('App import OK')"
Select-String app\templates\workstation.html -Pattern "decisionPipelinePanel|institutionalIntelligencePanel|data-dock-tab|block scripts"
```

Expected:
- `decisionPipelinePanel` appears once.
- `institutionalIntelligencePanel` appears once.
- `data-dock-tab` appears four times.
- `block scripts` appears once.
