# Version 84.0 — Paper Trade Journal & Review

## 1. Copy files

```powershell
Copy-Item payload\app\static\js\paper\paper_trade_journal_v84.js app\static\js\paper\paper_trade_journal_v84.js -Force
Copy-Item payload\app\static\js\paper\session_review_dashboard_v84.js app\static\js\paper\session_review_dashboard_v84.js -Force
Copy-Item payload\app\static\js\paper\rule_compliance_review_v84.js app\static\js\paper\rule_compliance_review_v84.js -Force
Copy-Item payload\app\static\css\paper_trade_journal_v84.css app\static\css\paper_trade_journal_v84.css -Force
```

## 2. Add CSS to `base.html`

```html
<link rel="stylesheet" href="/static/css/paper_trade_journal_v84.css">
```

## 3. Add placeholders to `_center_workspace.html`

```html
<section id="sessionReviewDashboardPanelV84"></section>
<section id="paperTradeJournalPanelV84"></section>
<section id="ruleComplianceReviewPanelV84"></section>
```

## 4. Add scripts to `_script_loader.html`

```html
<script src="/static/js/paper/paper_trade_journal_v84.js"></script>
<script src="/static/js/paper/session_review_dashboard_v84.js"></script>
<script src="/static/js/paper/rule_compliance_review_v84.js"></script>
```
