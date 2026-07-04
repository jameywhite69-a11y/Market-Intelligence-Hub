# Version 96.0 — Workspace Consolidation & Polish

```powershell
Copy-Item payload\app\static\js\system\workspace_consolidation_engine_v96.js app\static\js\system\workspace_consolidation_engine_v96.js -Force
Copy-Item payload\app\static\js\system\workspace_section_health_v96.js app\static\js\system\workspace_section_health_v96.js -Force
Copy-Item payload\app\static\js\system\workstation_release_summary_v96.js app\static\js\system\workstation_release_summary_v96.js -Force
Copy-Item payload\app\static\css\workspace_consolidation_v96.css app\static\css\workspace_consolidation_v96.css -Force
```

Add CSS:

```html
<link rel="stylesheet" href="/static/css/workspace_consolidation_v96.css">
```

Add placeholders:

```html
<section id="workspaceConsolidationPanelV96"></section>
<section id="workspaceSectionHealthPanelV96"></section>
<section id="workstationReleaseSummaryPanelV96"></section>
```

Add scripts near final system integrations:

```html
<script src="/static/js/system/workspace_consolidation_engine_v96.js"></script>
<script src="/static/js/system/workspace_section_health_v96.js"></script>
<script src="/static/js/system/workstation_release_summary_v96.js"></script>
```
