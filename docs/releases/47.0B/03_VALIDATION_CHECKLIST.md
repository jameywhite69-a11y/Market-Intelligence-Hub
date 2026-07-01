# Validation Checklist — Version 47.0B

```powershell
python -m compileall app
python -m pytest tests
python -c "from app.main import app; print('App import OK')"
Select-String app\templates\workstation.html -Pattern "block content|block scripts|decisionPipelinePanel|institutionalIntelligencePanel|<script src"
```

## Duplicate check

Run:

```powershell
python -c "from pathlib import Path; import re; t=Path('app/templates/workstation.html').read_text(); ids=re.findall(r'id=\"([^\"]+)\"', t); print([x for x in sorted(set(ids)) if ids.count(x)>1])"
```

Expected:

```text
[]
```

## Script block check

There should be no `<section` lines after `{% block scripts %}`.
