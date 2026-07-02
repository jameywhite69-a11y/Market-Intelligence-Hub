/*
Version 50.0 — TIOS Panel Registry
Single source of truth for where panels belong in the workstation.
*/
(function () {
    const KEY = "tios.panel.registry.v50";
    const panels = new Map();

    const DEFAULTS = [
        // Center top
        { id: "portfolioSummaryCards", region: "centerTop", order: 10, title: "Portfolio Summary" },
        { id: "workspaceProfiles", region: "centerTop", order: 20, title: "Workspace Profiles" },
        { id: "multiWatchlistDashboard", region: "centerTop", order: 30, title: "Watchlist Dashboard" },
        { id: "opportunityHeatmap", region: "centerTop", order: 40, title: "Opportunity Heatmap" },
        { id: "opportunityQueue", region: "centerTop", order: 50, title: "Live Opportunities" },

        // Center decision
        { id: "decisionPipelinePanel", region: "centerDecision", order: 10, title: "Decision Intelligence", height: "compact" },
        { id: "institutionalDecisionPackagePanel", region: "centerDecision", order: 20, title: "Institutional Decision Package", height: "compact" },
        { id: "institutionalDecisionCardPanel", region: "centerDecision", order: 30, title: "Institutional Decision Card", height: "compact" },
        { id: "institutionalIntelligencePanel", region: "centerDecision", order: 40, title: "Institutional Intelligence", height: "compact" },
        { id: "decisionStagePipelinePanel", region: "centerDecision", order: 50, title: "Decision Stage Pipeline", height: "compact" },

        // Center results
        { id: "workstationResultsPanel", region: "centerResults", order: 10, title: "Institutional Ranked Results" },
        { id: "opportunityHistory", region: "centerResults", order: 20, title: "Opportunity History" },
        { id: "scannerDiagnostics", region: "centerResults", order: 30, title: "Scanner Diagnostics" },
        { id: "coreDiagnosticsPanel", region: "centerResults", order: 40, title: "Core Diagnostics" },
        { id: "eventDiagnosticsPanel", region: "centerResults", order: 50, title: "Event Diagnostics" },

        // Right execution
        { id: "brokerAdapterPanel", region: "rightExecution", order: 10, title: "Broker Adapter" },
        { id: "institutionalCommandCenterPanel", region: "rightExecution", order: 20, title: "Command Center" },
        { id: "brokerManagerPanel", region: "rightExecution", order: 30, title: "Broker Manager" },
        { id: "tradeContextPanel", region: "rightExecution", order: 40, title: "Trade Context" },
        { id: "institutionalOrderTicket", region: "rightExecution", order: 50, title: "Order Ticket" },
        { id: "tradingTerminalPanel", region: "rightExecution", order: 60, title: "Trading Terminal" },
        { id: "paperTradingPanel", region: "rightExecution", order: 70, title: "Paper Trading" },

        // Right positions
        { id: "positionManagementPanel", region: "rightPositions", order: 10, title: "Position Management" },
        { id: "portfolioRiskPanel", region: "rightPositions", order: 20, title: "Portfolio Risk" },
        { id: "positionLifecyclePanel", region: "rightPositions", order: 30, title: "Position Lifecycle" },
        { id: "portfolioIntelligencePanel", region: "rightPositions", order: 40, title: "Portfolio Intelligence" },
        { id: "tradeLifecyclePanel", region: "rightPositions", order: 50, title: "Trade Lifecycle" },
        { id: "institutionalRiskPanel", region: "rightPositions", order: 60, title: "Institutional Risk" },

        // Right AI/debug
        { id: "opportunityPanel", region: "rightAI", order: 10, title: "Opportunity Panel" },
        { id: "decisionPipelineMonitorPanel", region: "rightAI", order: 20, title: "Pipeline Monitor" },
        { id: "decisionObjectInspectorPanel", region: "rightAI", order: 30, title: "Decision Inspector" },
        { id: "decisionAuditTrailPanel", region: "rightAI", order: 40, title: "Decision Audit Trail" },
        { id: "institutionalDecisionAuditPanelV48", region: "rightAI", order: 50, title: "Institutional Audit" },
        { id: "aiDecisionCenterPanel", region: "rightAI", order: 60, title: "AI Decision Center" },
        { id: "newsCatalystCenterPanel", region: "rightAI", order: 70, title: "News Catalyst Center" },
        { id: "strategyRegistryPanel", region: "rightAI", order: 80, title: "Strategy Registry" },

        // Right diagnostics
        { id: "liveMarketDataPanel", region: "rightDiagnostics", order: 10, title: "Live Market Data" },
        { id: "workspaceContextPanel", region: "rightDiagnostics", order: 20, title: "Workspace Context" },
        { id: "moduleRegistryPanel", region: "rightDiagnostics", order: 30, title: "Module Registry" },
        { id: "workspaceHealthDashboardPanel", region: "rightDiagnostics", order: 40, title: "Workspace Health" },
        { id: "activityTimelinePanel", region: "rightDiagnostics", order: 50, title: "Activity Timeline" },
        { id: "tradeJournalPanel", region: "rightDiagnostics", order: 60, title: "Trade Journal" },
        { id: "workspaceProfilesPanel", region: "rightDiagnostics", order: 70, title: "Workspace Profiles Panel" },
        { id: "commercialReadinessPanel", region: "rightDiagnostics", order: 80, title: "Commercial Readiness" },
        { id: "automationCenterPanel", region: "rightDiagnostics", order: 90, title: "Automation Center" }
    ];

    function register(config) {
        if (!config || !config.id) return false;
        panels.set(config.id, {
            region: "centerResults",
            order: 999,
            visible: true,
            height: "normal",
            title: config.id,
            ...config
        });
        persist();
        window.EventBus?.publish?.("layout.panel.registered", { panel: panels.get(config.id) });
        return true;
    }

    function registerMany(list) {
        (list || []).forEach(register);
    }

    function all() {
        return [...panels.values()].sort((a, b) => {
            if (a.region === b.region) return (a.order || 999) - (b.order || 999);
            return String(a.region).localeCompare(String(b.region));
        });
    }

    function byRegion(region) {
        return all().filter(panel => panel.region === region && panel.visible !== false);
    }

    function get(id) {
        return panels.get(id) || null;
    }

    function setRegion(id, region) {
        const panel = panels.get(id);
        if (!panel) return false;
        panel.region = region;
        persist();
        window.EventBus?.publish?.("layout.panel.updated", { panel });
        return true;
    }

    function persist() {
        try {
            localStorage.setItem(KEY, JSON.stringify(all()));
        } catch {}
    }

    function restore() {
        try {
            const stored = JSON.parse(localStorage.getItem(KEY) || "[]");
            if (stored.length) {
                stored.forEach(register);
                return true;
            }
        } catch {}
        return false;
    }

    function reset() {
        panels.clear();
        DEFAULTS.forEach(register);
        persist();
        window.EventBus?.publish?.("layout.registry.reset", { panels: all() });
    }

    if (!restore()) {
        DEFAULTS.forEach(register);
    }

    window.TIOSPanelRegistry = {
        register,
        registerMany,
        all,
        byRegion,
        get,
        setRegion,
        reset,
        defaults: DEFAULTS.slice()
    };
})();
