# Validation

```powershell
python -m compileall app
python -c "from app.main import app; print('App import OK')"
```

Browser console:

```javascript
typeof BrokerReadinessLayerV90
BrokerReadinessLayerV90.version
BrokerReadinessLayerV90.snapshot()
LiveRoutingGuardV90.check()
```

Expected:

```text
"object"
"90.1"
No Maximum call stack size exceeded error
```
