from pathlib import Path

ROOT = Path.cwd()
TEMPLATE = ROOT / "app" / "templates" / "workstation.html"

SCRIPT_ORDER = [
    "core/dom_registry.js","core/event_bus.js","core/workspace_store.js","core/module_registry.js","core/workspace_context.js","core/lifecycle_manager.js","core/workspace_persistence.js",
    "core/api_client.js","scanner_api_client.js","watchlist_api_client.js","technical_api_client.js","execution_api_client.js",
    "intelligence/unified_opportunity_store.js","intelligence/scanner_selection_unifier.js","intelligence/workspace_synchronization_engine.js","intelligence/event_recorder.js","intelligence/workspace_health_dashboard.js",
    "decision/decision_engine.js","decision/decision_pipeline_panel.js","decision/decision_timeline.js","decision/institutional_decision_card.js","decision/decision_pipeline_monitor.js","decision/decision_pipeline_monitor_panel.js","decision/decision_object_inspector.js","decision/decision_audit_trail.js","decision/decision_audit_panel.js",
    "institutional/institutional_scoring_engine.js","institutional/strategy_consensus_engine.js","institutional/opportunity_ranking_engine.js","institutional/institutional_audit.js","institutional/institutional_intelligence_panel.js","institutional/institutional_decision_package.js","institutional/institutional_decision_package_panel.js","institutional/decision_stage_pipeline.js","institutional/decision_stage_pipeline_panel.js","institutional/institutional_decision_audit_v48.js","institutional/institutional_decision_audit_panel_v48.js",
    "workstation/workspace_context_panel.js","workstation/module_registry_panel.js","workstation/workstation_bootstrap.js","workstation/trading_terminal_panel.js","workstation/workstation_compatibility_layer.js",
    "scanner/scanner_state.js","scanner/scanner_events.js","scanner/scanner_utils.js","scanner/scanner_status.js","scanner/ui_empty_states.js","scanner/watchlist_manager.js","scanner/opportunity_intelligence_panel.js","scanner/lifecycle_panel.js","scanner/portfolio_intelligence_panel.js","scanner/strategy_matrix_panel.js","scanner/confluence_panel.js","scanner/decision_panel.js","scanner/confidence_panel.js","scanner/strategy_score_panel.js","scanner/trade_plan_panel.js","scanner/technical_intelligence.js","scanner/opportunity_panel.js","scanner/scanner_results.js","scanner/scanner_filters.js","scanner/scanner_diagnostics.js","scanner/scanner_export.js","scanner/scanner_live.js","scanner/opportunity_queue.js","scanner/portfolio_snapshot.js","scanner/workspace_layout.js","scanner/workspace_intelligence.js","scanner/paper_trading_panel.js","scanner/scanner_orchestrator.js",
    "trading/trade_context.js","trading/risk_engine.js","trading/lifecycle_engine.js","trading/trade_context_panel.js","trading/order_ticket.js","trading/institutional_order_ticket_v42.js","execution/broker_adapter_panel.js","positions/position_management_panel.js","positions/portfolio_risk_panel.js","positions/position_lifecycle_panel.js",
    "market/live_market_data_client.js","market/live_market_data_panel.js","strategy/strategy_execution_client.js","strategy/strategy_execution_panel.js","ai/ai_decision_client.js","ai/ai_decision_center_panel.js","portfolio/portfolio_intelligence_client.js","portfolio/portfolio_intelligence_panel.js","lifecycle/trade_lifecycle_client.js","lifecycle/trade_lifecycle_panel.js","risk/institutional_risk_client.js","risk/institutional_risk_panel.js",
    "timeline/activity_timeline_store.js","timeline/activity_timeline_subscribers.js","timeline/activity_timeline_panel.js","journal/trade_journal_store.js","journal/performance_analytics.js","journal/trade_journal_panel.js","workspace/workspace_profiles.js","workspace/workspace_profiles_panel.js","workspace/professional_status_bar_v42.js","workspace/commercial_readiness_panel.js","automation/automation_center.js","command/command_center_store.js","command/command_center_orchestrator.js","command/command_center_panel.js","broker/broker_manager_panel.js","market_intelligence/news_catalyst_center.js","research/strategy_registry_client.js","research/strategy_registry_panel.js",
    "core/scanner_pipeline.js","core/pipeline_subscribers.js","core/event_diagnostics.js","core/core_bootstrap.js","workstation/platform_asset_validator.js","workstation/institutional_dock_system.js"
]

included = [rel for rel in SCRIPT_ORDER if (ROOT / "app" / "static" / "js" / rel).exists()]
missing = [rel for rel in SCRIPT_ORDER if rel not in included]
scripts_html = "\n".join(f'<script src="/static/js/{rel}"></script>' for rel in included)

workstation = """{% extends "base.html" %}

{% block content %}
<section class="tios-workstation-shell" data-tios-version="49.1">
    <header class="tios-topbar">
        <div class="tios-brand">
            <h1>Market Intelligence Hub</h1>
            <span>TIOS Professional Alpha - Inventory-Based Workstation</span>
        </div>
        <nav class="tios-topnav" aria-label="Primary navigation">
            <a href="/">Dashboard</a>
            <a href="/scanner">Scanner</a>
            <a href="/strategy">Strategy</a>
            <a href="/ai-lab">AI Lab</a>
            <a href="/broker">Broker</a>
        </nav>
    </header>

    <section class="tios-execution-ribbon" id="workstationExecutionRibbon">
        <div><b>Equity</b><span>-</span></div>
        <div><b>Cash</b><span>-</span></div>
        <div><b>Open P&L</b><span>-</span></div>
        <div><b>Status</b><span>Paper</span></div>
    </section>

    <section class="tios-three-column-layout">
        <aside class="tios-left-rail">
            <section class="desk-panel">
                <h2>Watchlists</h2>
                <label for="watchlistSelect">Active Watchlist</label>
                <select id="watchlistSelect"></select>
                <input id="newWatchlistName" placeholder="New watchlist name">
                <div class="desk-button-row">
                    <button id="createWatchlistButton" class="secondary-button">Create</button>
                    <button id="deleteWatchlistButton" class="danger-button">Delete</button>
                </div>
                <label for="addSymbolInput">Add Symbol</label>
                <div class="inline-control">
                    <input id="addSymbolInput" placeholder="AAPL">
                    <button id="addSymbolButton">Add</button>
                </div>
                <div id="watchlistSymbols" class="watchlist-symbols"></div>
                <label for="importSymbolsInput">Import Symbols</label>
                <textarea id="importSymbolsInput" placeholder="Paste CSV or one symbol per line"></textarea>
                <button id="exportWatchlistButton" class="secondary-button">Export Watchlist</button>
            </section>

            <section class="desk-panel">
                <h2>Scanner</h2>
                <label for="symbolsInput">Symbols</label>
                <input id="symbolsInput" value="BTC,ETH,SOL">
                <label for="timeframesInput">Timeframes</label>
                <input id="timeframesInput" value="15m,1h">
                <label for="indicatorsInput">Indicators</label>
                <input id="indicatorsInput" value="SMA,EMA,VWMA">
                <div class="desk-button-row">
                    <button id="runScanButton">Run Scan</button>
                    <button id="exportCsvButton" class="secondary-button">Export CSV</button>
                </div>
                <div id="scanStatus" class="scanner-status">Ready</div>
            </section>

            <section class="desk-panel">
                <h2>Live Scan</h2>
                <label for="refreshIntervalSelect">Refresh Interval</label>
                <select id="refreshIntervalSelect">
                    <option value="15">15 seconds</option>
                    <option value="30" selected>30 seconds</option>
                    <option value="60">1 minute</option>
                    <option value="300">5 minutes</option>
                </select>
                <div class="desk-button-row">
                    <button id="liveModeButton">Start Live</button>
                    <button id="pauseLiveButton" class="secondary-button" disabled>Pause</button>
                </div>
                <div id="countdownLabel" class="scanner-status">Paused</div>
                <div class="scanner-status">Last: <span id="lastScanLabel">-</span></div>
            </section>

            <section class="desk-panel">
                <h2>Filters</h2>
                <label for="minScoreInput">Minimum Score</label>
                <input id="minScoreInput" type="number" min="0" max="100" value="0">
                <label for="gradeFilterSelect">Grade</label>
                <select id="gradeFilterSelect">
                    <option value="all">All Grades</option>
                    <option value="A+">A+</option>
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                    <option value="D">D</option>
                </select>
                <label for="confidenceFilterSelect">Confidence</label>
                <select id="confidenceFilterSelect">
                    <option value="all">All Confidence</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                </select>
            </section>
        </aside>

        <main class="tios-center-workspace">
            <section id="portfolioSummaryCards" class="terminal-summary-cards"></section>

            <section class="tios-mini-panel-grid">
                <section id="workspaceProfiles" class="desk-panel compact"></section>
                <section id="multiWatchlistDashboard" class="desk-panel compact"></section>
                <section id="opportunityHeatmap" class="desk-panel compact"></section>
                <section id="opportunityQueue" class="desk-panel compact"></section>
            </section>

            <section class="tios-decision-workspace">
                <section id="decisionPipelinePanel" class="tios-scroll-card"></section>
                <section id="institutionalDecisionPackagePanel" class="tios-scroll-card"></section>
                <section id="institutionalDecisionCardPanel" class="tios-scroll-card"></section>
                <section id="institutionalIntelligencePanel" class="tios-scroll-card"></section>
                <section id="decisionStagePipelinePanel" class="tios-scroll-card"></section>
            </section>

            <section class="desk-panel workstation-results-panel">
                <div class="desk-panel-header">
                    <h2>Institutional Ranked Results</h2>
                    <span id="resultCount">0 results</span>
                </div>
                <div class="workstation-results-scroll">
                    <table class="scanner-table professional-grid expanded-grid terminal-results-table">
                        <thead>
                            <tr>
                                <th data-sort="rank">Rank</th>
                                <th data-sort="symbol">Symbol</th>
                                <th data-sort="timeframe">TF</th>
                                <th data-sort="score">Opportunity</th>
                                <th data-sort="grade">Decision</th>
                                <th data-sort="confidence">Confidence</th>
                                <th>Expected R</th>
                                <th>Allocation</th>
                                <th>Momentum</th>
                                <th>Status</th>
                                <th>Paper</th>
                                <th>Warnings</th>
                            </tr>
                        </thead>
                        <tbody id="scannerResultsBody">
                            <tr>
                                <td colspan="12" class="empty-row">
                                    <div class="quiet-empty-state">
                                        <div class="quiet-empty-icon">*</div>
                                        <div><b>Ready</b><span>Run scan</span></div>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>

            <section class="tios-bottom-diagnostics">
                <section id="opportunityHistory" class="desk-panel compact"></section>
                <section id="scannerDiagnostics" class="desk-panel compact"></section>
                <section id="coreDiagnosticsPanel" class="desk-panel compact"></section>
                <section id="eventDiagnosticsPanel" class="desk-panel compact"></section>
            </section>
        </main>

        <aside class="tios-right-rail workstation-right-dock">
            <div class="institutional-dock">
                <div class="institutional-dock-tabs">
                    <button class="institutional-dock-tab active" data-dock-tab="execution">Execution</button>
                    <button class="institutional-dock-tab" data-dock-tab="positions">Positions</button>
                    <button class="institutional-dock-tab" data-dock-tab="ai">AI</button>
                    <button class="institutional-dock-tab" data-dock-tab="diagnostics">Diagnostics</button>
                </div>
                <div class="institutional-dock-panels">
                    <div class="institutional-dock-panel active" data-dock-panel="execution"></div>
                    <div class="institutional-dock-panel" data-dock-panel="positions"></div>
                    <div class="institutional-dock-panel" data-dock-panel="ai"></div>
                    <div class="institutional-dock-panel" data-dock-panel="diagnostics"></div>
                </div>
            </div>

            <section id="brokerAdapterPanel"></section>
            <section id="institutionalCommandCenterPanel"></section>
            <section id="brokerManagerPanel"></section>
            <section id="tradeContextPanel"></section>
            <section id="institutionalOrderTicket"></section>
            <section id="tradingTerminalPanel" class="trading-terminal-dock"></section>
            <section id="paperTradingPanel" class="paper-trading-panel"></section>

            <section id="positionManagementPanel"></section>
            <section id="portfolioRiskPanel"></section>
            <section id="positionLifecyclePanel"></section>
            <section id="portfolioIntelligencePanel"></section>
            <section id="tradeLifecyclePanel"></section>
            <section id="institutionalRiskPanel"></section>

            <section id="opportunityPanel" class="opportunity-panel workstation-ai-panel"></section>
            <section id="decisionPipelineMonitorPanel"></section>
            <section id="decisionObjectInspectorPanel"></section>
            <section id="decisionAuditTrailPanel"></section>
            <section id="institutionalDecisionAuditPanelV48"></section>
            <section id="aiDecisionCenterPanel"></section>
            <section id="newsCatalystCenterPanel"></section>
            <section id="strategyRegistryPanel"></section>

            <section id="liveMarketDataPanel"></section>
            <section id="workspaceContextPanel"></section>
            <section id="moduleRegistryPanel"></section>
            <section id="workspaceHealthDashboardPanel"></section>
            <section id="activityTimelinePanel"></section>
            <section id="tradeJournalPanel"></section>
            <section id="workspaceProfilesPanel"></section>
            <section id="commercialReadinessPanel"></section>
            <section id="automationCenterPanel"></section>
        </aside>
    </section>
</section>
{% endblock %}

{% block scripts %}
__SCRIPTS__
{% endblock %}
"""

workstation = workstation.replace("__SCRIPTS__", scripts_html)

backup = TEMPLATE.with_suffix(".pre49_1.backup.html")
if TEMPLATE.exists() and not backup.exists():
    backup.write_text(TEMPLATE.read_text(encoding="utf-8"), encoding="utf-8")

TEMPLATE.write_text(workstation, encoding="utf-8")

report = ROOT / "docs" / "releases" / "49.1" / "inventory_report.txt"
report.parent.mkdir(parents=True, exist_ok=True)
report.write_text(
    "Version 49.1 Inventory-Based Workstation\n\n"
    f"Included scripts ({len(included)}):\n" +
    "\n".join(f"  - {x}" for x in included) +
    "\n\nSkipped missing scripts ({len(missing)}):\n" +
    "\n".join(f"  - {x}" for x in missing) +
    "\n",
    encoding="utf-8"
)

print("Generated app/templates/workstation.html")
print(f"Included scripts: {len(included)}")
print(f"Skipped missing scripts: {len(missing)}")
print("Report:", report)
