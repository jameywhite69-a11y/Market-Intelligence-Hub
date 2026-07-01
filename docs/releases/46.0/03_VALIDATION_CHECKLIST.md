# Validation

```powershell
python -m compileall app
python -m pytest tests
python -c "from app.main import app; print('App import OK')"
```

Browser console:
```javascript
typeof DecisionEngine
typeof DecisionPipelinePanel
typeof DecisionTimeline
DecisionEngine.current()
```
