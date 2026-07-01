# Validation Checklist — Version 46.1

```powershell
python -m compileall app
python -m pytest tests
python -c "from app.main import app; print('App import OK')"
```

Browser Console:

```javascript
typeof DecisionPipelineMonitor
typeof DecisionPipelineMonitorPanel
typeof DecisionObjectInspector
typeof InstitutionalDecisionCard
typeof DecisionAuditTrail
typeof DecisionAuditPanel
```

Expected: all return `"object"`.

Manual:

1. Open `/workstation`
2. Run scan
3. Click an opportunity
4. Open AI tab
5. Confirm decision card, pipeline monitor, inspector, and audit trail update
