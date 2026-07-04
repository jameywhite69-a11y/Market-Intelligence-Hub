# Version 103.1 — Live Broker Wizard Syntax Fix

This fixes:

```text
Uncaught SyntaxError: Unexpected end of input
```

## Copy fixed file

```powershell
Copy-Item payload\app\static\js\broker\live_broker_enablement_wizard_v103.js app\static\js\broker\live_broker_enablement_wizard_v103.js -Force
```

No template changes are required.
