```powershell
python -m compileall app
python -c "from app.main import app; print('App import OK')"
Select-String app\templates\base.html -Pattern "paper_trade_journal_v84.css"
Select-String app\templates\workstation\_center_workspace.html -Pattern "sessionReviewDashboardPanelV84|paperTradeJournalPanelV84|ruleComplianceReviewPanelV84"
Select-String app\templates\workstation\_script_loader.html -Pattern "paper_trade_journal_v84|session_review_dashboard_v84|rule_compliance_review_v84"
```

Browser:

```javascript
typeof PaperTradeJournalV84
typeof SessionReviewDashboardV84
typeof RuleComplianceReviewV84
PaperTradeJournalV84.buildEntries()
```
