# Version 90.1 — Broker Recursion Hotfix

## Problem fixed

The V90 broker readiness panel caused:

```text
RangeError: Maximum call stack size exceeded
```

because `render()` called `auditOrder()`, which called `save()`, which called `publish()`, which caused another render cycle.

## Copy fixed file

```powershell
Copy-Item payload\app\static\js\broker\broker_readiness_layer_v90.js app\static\js\broker\broker_readiness_layer_v90.js -Force
```

No template changes are required.
