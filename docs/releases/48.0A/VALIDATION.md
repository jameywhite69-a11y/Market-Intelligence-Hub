# Validation

```powershell
python -m compileall app
python -m pytest tests
python -c "from app.main import app; print('App import OK')"
.\tools\check_decision_zone.ps1
```

Browser:
1. Open `/workstation`.
2. Run scan.
3. Click an opportunity.
4. Confirm large decision panels appear in the center.
5. Confirm right AI tab has compact panels only.
