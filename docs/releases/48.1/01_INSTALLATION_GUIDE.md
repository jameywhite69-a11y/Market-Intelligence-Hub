# Installation Guide — Version 48.1

## 1. Copy CSS

```powershell
Copy-Item payload\app\static\css\professional_decision_workspace.css app\static\css\professional_decision_workspace.css -Force
```

## 2. Add CSS link to `base.html`

```html
<link rel="stylesheet" href="/static/css/professional_decision_workspace.css">
```

## 3. Confirm center decision zone

```html
<section class="workstation-decision-zone">
    <section id="decisionPipelinePanel"></section>
    <section id="institutionalDecisionPackagePanel"></section>
    <section id="institutionalDecisionCardPanel"></section>
    <section id="institutionalIntelligencePanel"></section>
    <section id="decisionStagePipelinePanel"></section>
</section>
```

## 4. Keep right AI dock compact

The large panels should not be in the dock map or right dock:
- `decisionPipelinePanel`
- `institutionalDecisionCardPanel`
- `institutionalIntelligencePanel`
- `institutionalDecisionPackagePanel`
- `decisionStagePipelinePanel`
