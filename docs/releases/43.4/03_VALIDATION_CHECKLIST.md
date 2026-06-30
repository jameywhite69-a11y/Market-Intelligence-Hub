# Validation Checklist — Version 43.4

```powershell
python -m compileall app
python -m pytest tests
python -c "from app.main import app; print('App import OK')"
python -c "from app.main import app; print([getattr(r,'path',None) for r in app.routes if '/api/research/strategies' in getattr(r,'path','')])"
```

Expected routes:

```text
['/api/research/strategies', '/api/research/strategies/health', '/api/research/strategies/{strategy_id}']
```

Manual:
1. Open `/workstation`
2. Open the AI tab
3. Confirm Strategy Registry appears
4. Click a strategy
5. Confirm Workspace Context strategy updates
