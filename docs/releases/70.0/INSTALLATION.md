# Version 70.0 — Release Candidate Hardening

## 1. Copy files

```powershell
Copy-Item payload\app\static\js\system\release_candidate_dashboard_v70.js app\static\js\system\release_candidate_dashboard_v70.js -Force
Copy-Item payload\app\static\js\system\platform_settings_store_v70.js app\static\js\system\platform_settings_store_v70.js -Force
Copy-Item payload\app\static\js\system\deployment_checklist_v70.js app\static\js\system\deployment_checklist_v70.js -Force
Copy-Item payload\app\static\css\release_candidate_v70.css app\static\css\release_candidate_v70.css -Force
```

## 2. Add CSS to `base.html`

```html
<link rel="stylesheet" href="/static/css/release_candidate_v70.css">
```

## 3. Add placeholders to `_center_workspace.html`

Inside `.native-decision-grid`, preferably near the top or bottom release/status area:

```html
<section id="releaseCandidateDashboardV70Panel"></section>
<section id="platformSettingsPanelV70"></section>
<section id="deploymentChecklistPanelV70"></section>
```

## 4. Add scripts to `_script_loader.html`

Add near the final system/finalizer scripts:

```html
<script src="/static/js/system/platform_settings_store_v70.js"></script>
<script src="/static/js/system/release_candidate_dashboard_v70.js"></script>
<script src="/static/js/system/deployment_checklist_v70.js"></script>
```

## 5. Open

```text
http://127.0.0.1:8000/workstation_v54
```
