# Validation Checklist

```powershell
python -m compileall app
python -m pytest tests
python -c "from app.main import app; print('App import OK')"
```

Browser Console:

```javascript
typeof InstitutionalScoringEngine
typeof StrategyConsensusEngine
typeof OpportunityRankingEngine
typeof InstitutionalAudit
typeof InstitutionalIntelligencePanel
```
