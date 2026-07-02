/*
Version 49.2 — Runtime Layout Composer
Preserves existing module initialization, then relocates rendered panels into a professional layout.
*/
(function () {
    const VERSION = "49.2";

    const CENTER_TOP = [
        "portfolioSummaryCards",
        "workspaceProfiles",
        "multiWatchlistDashboard",
        "opportunityHeatmap",
        "opportunityQueue"
    ];

    const CENTER_DECISION = [
        "decisionPipelinePanel",
        "institutionalDecisionPackagePanel",
        "institutionalDecisionCardPanel",
        "institutionalIntelligencePanel",
        "decisionStagePipelinePanel"
    ];

    const CENTER_RESULTS = [
        "scannerResultsBody",
        "opportunityHistory",
        "scannerDiagnostics",
        "coreDiagnosticsPanel",
        "eventDiagnosticsPanel"
    ];

    const RIGHT_KEEP = [
        "brokerAdapterPanel",
        "institutionalCommandCenterPanel",
        "brokerManagerPanel",
        "tradeContextPanel",
        "institutionalOrderTicket",
        "tradingTerminalPanel",
        "paperTradingPanel",
        "positionManagementPanel",
        "portfolioRiskPanel",
        "positionLifecyclePanel",
        "portfolioIntelligencePanel",
        "tradeLifecyclePanel",
        "institutionalRiskPanel",
        "opportunityPanel",
        "decisionPipelineMonitorPanel",
        "decisionObjectInspectorPanel",
        "decisionAuditTrailPanel",
        "institutionalDecisionAuditPanelV48",
        "aiDecisionCenterPanel",
        "newsCatalystCenterPanel",
        "strategyRegistryPanel",
        "liveMarketDataPanel",
        "workspaceContextPanel",
        "moduleRegistryPanel",
        "workspaceHealthDashboardPanel",
        "activityTimelinePanel",
        "tradeJournalPanel",
        "workspaceProfilesPanel",
        "commercialReadinessPanel",
        "automationCenterPanel"
    ];

    function byId(id) {
        return document.getElementById(id);
    }

    function ensureShell() {
        if (document.getElementById("runtimeLayoutComposerShell")) return true;

        const shell = document.createElement("section");
        shell.id = "runtimeLayoutComposerShell";
        shell.className = "runtime-layout-shell";

        shell.innerHTML = `
            <aside id="runtimeLeftRail" class="runtime-left-rail"></aside>
            <main id="runtimeCenterWorkspace" class="runtime-center-workspace">
                <section id="runtimeCenterTop" class="runtime-center-top"></section>
                <section id="runtimeDecisionGrid" class="runtime-decision-grid"></section>
                <section id="runtimeResultsZone" class="runtime-results-zone"></section>
            </main>
            <aside id="runtimeRightRail" class="runtime-right-rail"></aside>
        `;

        const mainGrid =
            document.querySelector(".workstation-main-grid") ||
            document.querySelector(".tios-three-column-layout") ||
            document.querySelector(".terminal-workspace") ||
            document.querySelector("main") ||
            document.body;

        mainGrid.parentNode.insertBefore(shell, mainGrid);
        mainGrid.classList.add("runtime-original-layout-hidden");
        return true;
    }

    function moveIfExists(id, target) {
        const el = byId(id);
        const dest = byId(target);
        if (!el || !dest) return false;

        if (id === "scannerResultsBody") {
            const resultsPanel = document.querySelector(".workstation-results-panel");
            if (resultsPanel) {
                dest.appendChild(resultsPanel);
                resultsPanel.classList.add("runtime-results-panel");
                return true;
            }
            return false;
        }

        dest.appendChild(el);
        el.classList.add("runtime-composed-panel");
        return true;
    }

    function moveLeftRail() {
        const left = document.querySelector(".workstation-left-dock") ||
            document.querySelector(".tios-left-rail") ||
            document.querySelector(".scanner-filter-panel") ||
            null;

        const dest = byId("runtimeLeftRail");
        if (left && dest && left !== dest) {
            dest.appendChild(left);
            left.classList.add("runtime-left-content");
            return true;
        }
        return false;
    }

    function moveRightRail() {
        const dock = document.querySelector(".workstation-right-dock") ||
            document.querySelector(".tios-right-rail") ||
            null;

        const dest = byId("runtimeRightRail");
        if (dock && dest && dock !== dest) {
            dest.appendChild(dock);
            dock.classList.add("runtime-right-content");
            return true;
        }

        let moved = 0;
        RIGHT_KEEP.forEach(id => {
            if (moveIfExists(id, "runtimeRightRail")) moved++;
        });
        return moved > 0;
    }

    function compose() {
        ensureShell();

        const moved = {
            left: moveLeftRail(),
            centerTop: [],
            decision: [],
            results: [],
            right: moveRightRail()
        };

        CENTER_TOP.forEach(id => {
            if (moveIfExists(id, "runtimeCenterTop")) moved.centerTop.push(id);
        });

        CENTER_DECISION.forEach(id => {
            if (moveIfExists(id, "runtimeDecisionGrid")) moved.decision.push(id);
        });

        CENTER_RESULTS.forEach(id => {
            if (moveIfExists(id, "runtimeResultsZone")) moved.results.push(id);
        });

        document.body.dataset.runtimeLayoutComposer = VERSION;

        window.EventBus?.publish?.("runtime-layout.composed", { version: VERSION, moved });
        console.log("[TIOS Runtime Layout Composer]", { version: VERSION, moved });
        return moved;
    }

    function composeWhenReady() {
        const delays = [500, 1200, 2200, 3500];
        delays.forEach(delay => setTimeout(compose, delay));
    }

    window.RuntimeLayoutComposer = {
        compose,
        composeWhenReady,
        version: VERSION
    };

    document.addEventListener("DOMContentLoaded", composeWhenReady);
})();
