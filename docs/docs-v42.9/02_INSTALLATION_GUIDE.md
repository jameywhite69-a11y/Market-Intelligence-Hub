# Installation

## 1. Copy payload
Copy everything from `payload/` into your project root.

## 2. Add CSS to base.html

```html
<link rel="stylesheet" href="/static/css/automation_center.css">
```

## 3. Add panel to workstation.html

```html
<section id="automationCenterPanel"></section>
```

## 4. Add script

```html
<script src="/static/js/automation/automation_center.js"></script>
```

## 5. Dock placement

Add to `institutional_dock_system.js`:

```javascript
moveIntoDock("automationCenterPanel","diagnostics");
```
