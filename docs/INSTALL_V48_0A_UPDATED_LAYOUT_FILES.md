# Install v48.0A Updated Layout Files

## Do I add snippets to the root folder?

No. Do not add the `snippets` folder to your project root.

The snippets are only reference material. The actual files to copy are in `payload/`.

## Copy these files

```powershell
Copy-Item payload\app\templates\workstation.html app\templates\workstation.html -Force
Copy-Item payload\app\static\css\workstation_decision_zone.css app\static\css\workstation_decision_zone.css -Force
```

## Add CSS to base.html

Add this line to `app/templates/base.html` with the other CSS links:

```html
<link rel="stylesheet" href="/static/css/workstation_decision_zone.css">
```

## Update dock map

Open:

```text
app/static/js/workstation/institutional_dock_system.js
```

Replace the `ai:` list with the reference in:

```text
snippets/institutional_dock_ai_map.js
```

## Validate

```powershell
python -m compileall app
python -m pytest tests
python -c "from app.main import app; print('App import OK')"
python -c "from pathlib import Path; import re; t=Path('app/templates/workstation.html').read_text(); ids=re.findall(r'id=\"([^\"]+)\"', t); print([x for x in sorted(set(ids)) if ids.count(x)>1])"
Select-String app\templates\workstation.html -Pattern "workstation-decision-zone|institutionalDecisionPackagePanel|decisionStagePipelinePanel"
```
