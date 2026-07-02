# Version 51.1 — Architecture Discovery Report

## Executive Summary

Your uploaded architecture package confirms this is now a multi-module application, not a single workstation page. The recurring layout issues are caused by fragmented startup/layout ownership and duplicated module paths. Version 51 should consolidate startup and layout under Core before broker/live-execution work continues.

## Inventory
- Total files analyzed: **148**
- JavaScript files: **86**
- CSS files: **60**
- HTML templates: **2**

## Duplicate JS Filenames
- None found.

## Startup / Layout / Registry Files
- `core\core_bootstrap.js`
- `core\dom_registry.js`
- `core\event_bus.js`
- `core\module_registry.js`
- `core\workspace_store.js`
- `scanner\core\core_bootstrap.js`
- `scanner\core\dom_registry.js`
- `scanner\terminal_layout.js`
- `scanner\workspace_layout.js`
- `scanner\workstation\module_registry.js`
- `scanner\workstation\workstation_bootstrap.js`
- `workstation\institutional_dock_system.js`
- `workstation\module_registry_panel.js`
- `workstation\runtime_layout_composer.js`
- `workstation\workstation_bootstrap.js`
- `workstation\workstation_compatibility_layer.js`

## High-Risk DOM / Layout Mutation Points

### `appendChild` — total hits: 8
- `core\dom_registry.js` — 1
- `scanner\core\dom_registry.js` — 1
- `scanner\scanner_dom.js` — 1
- `workstation\institutional_dock_system.js` — 1
- `workstation\runtime_layout_composer.js` — 4

### `replaceChildren` — total hits: 0

### `innerHTML` — total hits: 54
- `core\core_bootstrap.js` — 1
- `core\dom_registry.js` — 1
- `core\event_diagnostics.js` — 1
- `css\decision\decision_audit_panel.js` — 1
- `css\decision\decision_object_inspector.js` — 1
- `css\decision\decision_pipeline_monitor_panel.js` — 1
- `css\decision\institutional_decision_card.js` — 2
- `decision\decision_pipeline_panel.js` — 2
- `institutional\decision_stage_pipeline_panel.js` — 2
- `institutional\institutional_decision_audit_panel_v48.js` — 1
- `institutional\institutional_decision_package_panel.js` — 2
- `institutional\institutional_intelligence_panel.js` — 2
- `scanner\command\command_center_panel.js` — 1
- `scanner\core\core_bootstrap.js` — 1
- `scanner\core\dom_registry.js` — 1
- `scanner\opportunity_explorer.js` — 1
- `scanner\opportunity_panel.js` — 3
- `scanner\opportunity_queue.js` — 2
- `scanner\paper_trading_panel.js` — 2
- `scanner\portfolio_snapshot.js` — 2
- `scanner\scanner_diagnostics.js` — 2
- `scanner\scanner_results.js` — 2
- `scanner\watchlist_manager.js` — 2
- `scanner\workspace_intelligence.js` — 7
- `scanner\workstation\trading_terminal_panel.js` — 2
- `scanner\workstation\workstation_bootstrap.js` — 2
- `workstation\module_registry_panel.js` — 1
- `workstation\runtime_layout_composer.js` — 1
- `workstation\trading_terminal_panel.js` — 2
- `workstation\workspace_context_panel.js` — 1
- `workstation\workstation_bootstrap.js` — 2

### `setTimeout` — total hits: 35
- `core\lifecycle_manager.js` — 1
- `core\workspace_persistence.js` — 1
- `css\decision\decision_audit_panel.js` — 1
- `css\decision\decision_object_inspector.js` — 1
- `css\decision\decision_pipeline_monitor_panel.js` — 1
- `css\decision\institutional_decision_card.js` — 2
- `decision\decision_engine.js` — 1
- `decision\decision_pipeline_panel.js` — 2
- `institutional\decision_stage_pipeline.js` — 1
- `institutional\decision_stage_pipeline_panel.js` — 1
- `institutional\institutional_decision_audit_panel_v48.js` — 1
- `institutional\institutional_decision_package.js` — 5
- `institutional\institutional_decision_package_panel.js` — 2
- `institutional\institutional_intelligence_panel.js` — 2
- `institutional\institutional_scoring_engine.js` — 1
- `institutional\opportunity_ranking_engine.js` — 2
- `institutional\strategy_consensus_engine.js` — 1
- `scanner\command\command_center_orchestrator.js` — 2
- `scanner\command\command_center_panel.js` — 1
- `workstation\institutional_dock_system.js` — 1
- `workstation\module_registry_panel.js` — 1
- `workstation\platform_asset_validator.js` — 1
- `workstation\runtime_layout_composer.js` — 1
- `workstation\workspace_context_panel.js` — 2

### `workstation-main-grid` — total hits: 1
- `workstation\runtime_layout_composer.js` — 1

### `institutional-dock` — total hits: 0

### `RuntimeLayoutComposer` — total hits: 1
- `workstation\runtime_layout_composer.js` — 1

### `TIOSLayoutManager` — total hits: 0

### `EventBus` — total hits: 96
- `core\event_bus.js` — 1
- `core\event_diagnostics.js` — 4
- `core\lifecycle_manager.js` — 2
- `core\module_registry.js` — 2
- `core\pipeline_subscribers.js` — 4
- `core\scanner_pipeline.js` — 4
- `core\workspace_context.js` — 2
- `core\workspace_persistence.js` — 4
- `core\workspace_store.js` — 3
- `css\decision\decision_audit_panel.js` — 2
- `css\decision\decision_audit_trail.js` — 6
- `css\decision\decision_object_inspector.js` — 3
- `css\decision\decision_pipeline_monitor.js` — 12
- `css\decision\decision_pipeline_monitor_panel.js` — 2
- `css\decision\institutional_decision_card.js` — 2
- `decision\decision_engine.js` — 4
- `decision\decision_pipeline_panel.js` — 2
- `decision\decision_timeline.js` — 1
- `institutional\decision_stage_pipeline.js` — 2
- `institutional\decision_stage_pipeline_panel.js` — 1
- `institutional\institutional_audit.js` — 1
- `institutional\institutional_decision_audit_panel_v48.js` — 1
- `institutional\institutional_decision_audit_v48.js` — 3
- `institutional\institutional_decision_package.js` — 5
- `institutional\institutional_decision_package_panel.js` — 2
- `institutional\institutional_intelligence_panel.js` — 3
- `institutional\institutional_scoring_engine.js` — 2
- `institutional\opportunity_ranking_engine.js` — 3
- `institutional\strategy_consensus_engine.js` — 2
- `scanner\command\command_center_orchestrator.js` — 1
- `scanner\command\command_center_panel.js` — 1
- `scanner\command\command_center_store.js` — 1
- `workstation\institutional_dock_system.js` — 1
- `workstation\module_registry_panel.js` — 3
- `workstation\platform_asset_validator.js` — 1
- ... 2 more files

## Template Script References

### `base.html`
1. `/static/js/app.js`

### `workstation.html`
1. `/static/js/workstation/runtime_layout_composer.js`
2. `/static/js/core/dom_registry.js`
3. `/static/js/core/event_bus.js`
4. `/static/js/core/workspace_store.js`
5. `/static/js/core/module_registry.js`
6. `/static/js/core/workspace_context.js`
7. `/static/js/core/lifecycle_manager.js`
8. `/static/js/core/workspace_persistence.js`
9. `/static/js/core/api_client.js`
10. `/static/js/scanner_api_client.js`
11. `/static/js/watchlist_api_client.js`
12. `/static/js/technical_api_client.js`
13. `/static/js/execution_api_client.js`
14. `/static/js/intelligence/unified_opportunity_store.js`
15. `/static/js/intelligence/scanner_selection_unifier.js`
16. `/static/js/intelligence/workspace_synchronization_engine.js`
17. `/static/js/intelligence/event_recorder.js`
18. `/static/js/intelligence/workspace_health_dashboard.js`
19. `/static/js/decision/decision_engine.js`
20. `/static/js/decision/decision_pipeline_panel.js`
21. `/static/js/decision/decision_timeline.js`
22. `/static/js/decision/institutional_decision_card.js`
23. `/static/js/decision/decision_pipeline_monitor.js`
24. `/static/js/decision/decision_pipeline_monitor_panel.js`
25. `/static/js/decision/decision_object_inspector.js`
26. `/static/js/decision/decision_audit_trail.js`
27. `/static/js/decision/decision_audit_panel.js`
28. `/static/js/institutional/institutional_scoring_engine.js`
29. `/static/js/institutional/strategy_consensus_engine.js`
30. `/static/js/institutional/opportunity_ranking_engine.js`
31. `/static/js/institutional/institutional_audit.js`
32. `/static/js/institutional/institutional_intelligence_panel.js`
33. `/static/js/institutional/institutional_decision_package.js`
34. `/static/js/institutional/institutional_decision_package_panel.js`
35. `/static/js/institutional/decision_stage_pipeline.js`
36. `/static/js/institutional/decision_stage_pipeline_panel.js`
37. `/static/js/institutional/institutional_decision_audit_v48.js`
38. `/static/js/institutional/institutional_decision_audit_panel_v48.js`
39. `/static/js/workstation/workspace_context_panel.js`
40. `/static/js/workstation/module_registry_panel.js`
41. `/static/js/workstation/workstation_bootstrap.js`
42. `/static/js/workstation/trading_terminal_panel.js`
43. `/static/js/workstation/workstation_compatibility_layer.js`
44. `/static/js/scanner/scanner_state.js`
45. `/static/js/scanner/scanner_events.js`
46. `/static/js/scanner/scanner_utils.js`
47. `/static/js/scanner/scanner_status.js`
48. `/static/js/scanner/ui_empty_states.js`
49. `/static/js/scanner/watchlist_manager.js`
50. `/static/js/scanner/opportunity_intelligence_panel.js`
51. `/static/js/scanner/lifecycle_panel.js`
52. `/static/js/scanner/portfolio_intelligence_panel.js`
53. `/static/js/scanner/strategy_matrix_panel.js`
54. `/static/js/scanner/confluence_panel.js`
55. `/static/js/scanner/decision_panel.js`
56. `/static/js/scanner/confidence_panel.js`
57. `/static/js/scanner/strategy_score_panel.js`
58. `/static/js/scanner/trade_plan_panel.js`
59. `/static/js/scanner/technical_intelligence.js`
60. `/static/js/scanner/opportunity_panel.js`
61. `/static/js/scanner/scanner_results.js`
62. `/static/js/scanner/scanner_filters.js`
63. `/static/js/scanner/scanner_diagnostics.js`
64. `/static/js/scanner/scanner_export.js`
65. `/static/js/scanner/scanner_live.js`
66. `/static/js/scanner/opportunity_queue.js`
67. `/static/js/scanner/portfolio_snapshot.js`
68. `/static/js/scanner/workspace_layout.js`
69. `/static/js/scanner/workspace_intelligence.js`
70. `/static/js/scanner/paper_trading_panel.js`
71. `/static/js/scanner/scanner_orchestrator.js`
72. `/static/js/trading/trade_context.js`
73. `/static/js/trading/risk_engine.js`
74. `/static/js/trading/lifecycle_engine.js`
75. `/static/js/trading/trade_context_panel.js`
76. `/static/js/trading/order_ticket.js`
77. `/static/js/trading/institutional_order_ticket_v42.js`
78. `/static/js/execution/broker_adapter_panel.js`
79. `/static/js/positions/position_management_panel.js`
80. `/static/js/positions/portfolio_risk_panel.js`
81. `/static/js/positions/position_lifecycle_panel.js`
82. `/static/js/market/live_market_data_client.js`
83. `/static/js/market/live_market_data_panel.js`
84. `/static/js/strategy/strategy_execution_client.js`
85. `/static/js/strategy/strategy_execution_panel.js`
86. `/static/js/ai/ai_decision_client.js`
87. `/static/js/ai/ai_decision_center_panel.js`
88. `/static/js/portfolio/portfolio_intelligence_client.js`
89. `/static/js/portfolio/portfolio_intelligence_panel.js`
90. `/static/js/lifecycle/trade_lifecycle_client.js`
91. `/static/js/lifecycle/trade_lifecycle_panel.js`
92. `/static/js/risk/institutional_risk_client.js`
93. `/static/js/risk/institutional_risk_panel.js`
94. `/static/js/timeline/activity_timeline_store.js`
95. `/static/js/timeline/activity_timeline_subscribers.js`
96. `/static/js/timeline/activity_timeline_panel.js`
97. `/static/js/journal/trade_journal_store.js`
98. `/static/js/journal/performance_analytics.js`
99. `/static/js/journal/trade_journal_panel.js`
100. `/static/js/workspace/workspace_profiles.js`
101. `/static/js/workspace/workspace_profiles_panel.js`
102. `/static/js/workspace/professional_status_bar_v42.js`
103. `/static/js/workspace/commercial_readiness_panel.js`
104. `/static/js/automation/automation_center.js`
105. `/static/js/command/command_center_store.js`
106. `/static/js/command/command_center_orchestrator.js`
107. `/static/js/command/command_center_panel.js`
108. `/static/js/broker/broker_manager_panel.js`
109. `/static/js/market_intelligence/news_catalyst_center.js`
110. `/static/js/research/strategy_registry_client.js`
111. `/static/js/research/strategy_registry_panel.js`
112. `/static/js/core/scanner_pipeline.js`
113. `/static/js/core/pipeline_subscribers.js`
114. `/static/js/core/event_diagnostics.js`
115. `/static/js/core/core_bootstrap.js`
116. `/static/js/workstation/platform_asset_validator.js`
117. `/static/js/workstation/institutional_dock_system.js`
118. `/static/js/layout/tios_panel_registry.js`
119. `/static/js/layout/tios_layout_manager.js`
120. `/static/js/layout/tios_layout_manager_panel.js`

## Recommended Migration Plan
### Version 51.1 — Discovery + Trace Baseline
- Add startup/layout trace without changing behavior.
- Identify which module re-renders or re-parents panels after the layout manager runs.

### Version 51.2 — Single Core Bootstrap
- Introduce one authoritative Core startup path.
- Make old bootstrap modules idempotent consumers rather than owners.

### Version 51.3 — Single Layout Authority
- Make Layout Manager consume Panel Registry.
- Remove competing layout composer behavior.

### Version 52 — Broker Integration Foundation
- Begin broker/live execution only after startup and layout ownership stabilize.

## Core Folder Recommendation
Keep the `core` folder. Core should own startup, eventing, state, services, panel registry, layout, logging, and trace. Feature folders should depend on Core, but Core should not depend on feature folders.

```text
app/static/js/core/
    app.js
    bootstrap.js
    module_loader.js
    service_registry.js
    panel_registry.js
    layout_manager.js
    startup_trace.js
    logger.js
    event_bus.js
    workspace_store.js
```