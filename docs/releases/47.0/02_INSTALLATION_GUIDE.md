# Installation Guide — Version 47.0

Copy payload into project root.

Add CSS to `base.html`:

```html
<link rel="stylesheet" href="/static/css/institutional_intelligence.css">
```

Add panel to AI group in `workstation.html`:

```html
<section id="institutionalIntelligencePanel"></section>
```

Add scripts after v46 decision scripts:

```html
<script src="/static/js/institutional/institutional_scoring_engine.js"></script>
<script src="/static/js/institutional/strategy_consensus_engine.js"></script>
<script src="/static/js/institutional/opportunity_ranking_engine.js"></script>
<script src="/static/js/institutional/institutional_audit.js"></script>
<script src="/static/js/institutional/institutional_intelligence_panel.js"></script>
```

Add `"institutionalIntelligencePanel"` to the `ai` list in `institutional_dock_system.js`.
