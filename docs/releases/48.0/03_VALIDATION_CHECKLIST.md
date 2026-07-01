# Validation Checklist — Version 48.0

```powershell
python -m compileall app
python -m pytest tests
python -c "from app.main import app; print('App import OK')"
```

Browser Console:

```javascript
typeof InstitutionalDecisionPackage
typeof InstitutionalDecisionPackagePanel
typeof DecisionStagePipeline
typeof DecisionStagePipelinePanel
typeof InstitutionalDecisionAuditV48
typeof InstitutionalDecisionAuditPanelV48
```

Expected: all return `"object"`.

Manual:

1. Open `/workstation`
2. Run scan
3. Click opportunity
4. Open AI tab
5. Confirm Institutional Decision Package, Decision Stage Pipeline, and Institutional Audit update
