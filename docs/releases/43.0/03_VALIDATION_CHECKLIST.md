# Validation Checklist — Version 43.0

## PowerShell Validation

```powershell
python -m compileall app
python -m pytest tests
python -c "from app.main import app; print('App import OK')"
```

## Manual UI Validation

1. Start MIH:
   ```powershell
   python -m uvicorn app.main:app --reload
   ```
2. Open:
   ```text
   http://127.0.0.1:8000/workstation
   ```
3. Run scanner.
4. Click an opportunity.
5. Confirm the Command Center updates:
   - Current Opportunity
   - AI Decision
   - Risk Approval
   - Lifecycle
   - Portfolio Heat
   - Buying Power
6. Submit paper order.
7. Confirm Command Center refreshes after fill.
