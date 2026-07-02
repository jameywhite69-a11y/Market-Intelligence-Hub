# Validation

```powershell
python -m compileall app
python -m pytest tests
python -c "from app.main import app; print('App import OK')"
Select-String app\templates\base.html -Pattern "runtime_layout_composer.css"
Select-String app\templates\workstation.html -Pattern "runtime_layout_composer.js"
```

Browser:

```text
http://127.0.0.1:8000/workstation?layout=492
```

Console:

```javascript
typeof RuntimeLayoutComposer
RuntimeLayoutComposer.compose()
document.body.dataset.runtimeLayoutComposer
```

Expected:

```text
"object"
"49.2"
```
