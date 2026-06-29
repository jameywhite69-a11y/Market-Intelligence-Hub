(function () {
    const modules = new Map();
    let started = false;

    function register(name, options) {
        modules.set(name, { name, dependencies: options.dependencies || [], start: options.start || (async () => {}), started: false, skipped: false, error: null });
    }

    function canStart(module) {
        return module.dependencies.every(name => modules.get(name)?.started);
    }

    async function startAll() {
        if (started) return;
        started = true;
        let progress = true;

        while (progress) {
            progress = false;
            for (const module of modules.values()) {
                if (module.started || module.skipped || module.error || !canStart(module)) continue;
                try {
                    await module.start();
                    module.started = true;
                    progress = true;
                    console.info(`Core module started: ${module.name}`);
                } catch (error) {
                    module.error = error;
                    progress = true;
                    console.error(`Core module failed: ${module.name}`, error);
                    window.WorkspaceStore?.pushError?.(error, module.name);
                }
            }
        }

        for (const module of modules.values()) {
            if (!module.started && !module.error) module.skipped = true;
        }

        renderDiagnostics();
        window.EventDiagnostics?.renderEventDiagnostics?.();
    }

    function status() {
        return Array.from(modules.values()).map(module => ({
            name: module.name,
            dependencies: module.dependencies,
            started: module.started,
            skipped: module.skipped,
            error: module.error ? module.error.message : null,
        }));
    }

    function renderDiagnostics() {
        const panel = document.getElementById("coreDiagnosticsPanel");
        if (!panel) return;
        const rows = status();
        panel.innerHTML = `
            <section class="core-diagnostics-card">
                <div class="core-diagnostics-header">
                    <h3>Core Diagnostics</h3>
                    <span>${rows.filter(row => row.started).length}/${rows.length} started</span>
                </div>
                <div class="core-diagnostics-list">
                    ${rows.map(row => `
                        <div class="core-diagnostics-row ${row.started ? "ok" : row.error ? "bad" : "warn"}">
                            <b>${row.name}</b>
                            <span>${row.started ? "Started" : row.error || "Skipped"}</span>
                        </div>
                    `).join("")}
                </div>
            </section>
        `;
    }

    function registerDefaultModules() {
        register("dom", { start: async () => {
            window.DOMRegistry?.registerScannerElements?.();
            window.scannerDom = {
                symbolsInput: DOMRegistry.get("symbolsInput"),
                timeframesInput: DOMRegistry.get("timeframesInput"),
                indicatorsInput: DOMRegistry.get("indicatorsInput"),
                runButton: DOMRegistry.get("runScanButton"),
                exportButton: DOMRegistry.get("exportCsvButton"),
                resultsBody: DOMRegistry.get("scannerResultsBody"),
                resultCount: DOMRegistry.get("resultCount"),
                status: DOMRegistry.get("scanStatus"),
                diagnosticsPanel: DOMRegistry.get("scannerDiagnostics"),
                opportunityPanel: DOMRegistry.get("opportunityPanel"),
                minScoreInput: DOMRegistry.get("minScoreInput"),
                gradeFilterSelect: DOMRegistry.get("gradeFilterSelect"),
                confidenceFilterSelect: DOMRegistry.get("confidenceFilterSelect"),
                liveModeButton: DOMRegistry.get("liveModeButton"),
                pauseLiveButton: DOMRegistry.get("pauseLiveButton"),
                refreshIntervalSelect: DOMRegistry.get("refreshIntervalSelect"),
                countdownLabel: DOMRegistry.get("countdownLabel"),
                lastScanLabel: DOMRegistry.get("lastScanLabel"),
                watchlistSelect: DOMRegistry.get("watchlistSelect"),
                newWatchlistName: DOMRegistry.get("newWatchlistName"),
                createWatchlistButton: DOMRegistry.get("createWatchlistButton"),
                deleteWatchlistButton: DOMRegistry.get("deleteWatchlistButton"),
                addSymbolInput: DOMRegistry.get("addSymbolInput"),
                addSymbolButton: DOMRegistry.get("addSymbolButton"),
                watchlistSymbols: DOMRegistry.get("watchlistSymbols"),
                importSymbolsInput: DOMRegistry.get("importSymbolsInput"),
                exportWatchlistButton: DOMRegistry.get("exportWatchlistButton"),
            };
        }});

        register("store", { dependencies: ["dom"], start: async () => WorkspaceStore?.set?.("scannerResults", window.scannerState?.results || []) });
        register("api", { dependencies: ["store"], start: async () => { if (!window.ApiClient) throw new Error("ApiClient not loaded."); }});
        register("compatibility", { dependencies: ["api"], start: async () => window.workstationCompatibilityLayer?.applyCompatibilityLayer?.() });
        register("pipeline-subscribers", { dependencies: ["compatibility"], start: async () => window.PipelineSubscribers?.registerPipelineSubscribers?.() });
        register("watchlists", { dependencies: ["compatibility"], start: async () => {
            if (window.watchlistManager?.bootstrapWatchlists) await window.watchlistManager.bootstrapWatchlists();
            else if (window.watchlistManager?.loadWatchlists) await window.watchlistManager.loadWatchlists();
        }});
        register("scanner-events", { dependencies: ["pipeline-subscribers"], start: async () => {
            window.scannerOrchestrator?.bindCoreEvents?.();
            window.scannerStatus?.setStatus?.("Ready");
        }});
        register("filters", { dependencies: ["compatibility"], start: async () => window.scannerFilters?.bindFilteringAndSorting?.() });
        register("live-scan", { dependencies: ["compatibility"], start: async () => {
            window.scannerLive?.bindLiveControls?.();
            window.scannerLive?.stopLiveMode?.();
        }});
        register("workspace-intelligence", { dependencies: ["watchlists"], start: async () => {
            window.workspaceLayout?.bindWorkspaceLayout?.();
            window.workspaceIntelligence?.renderWorkspaceIntelligence?.(window.scannerState?.filteredResults || []);
        }});
        register("paper-trading", { dependencies: ["compatibility"], start: async () => {
            await window.paperTradingPanel?.renderPaperTradingPanel?.();
            await window.tradingTerminalPanel?.renderTradingTerminalPanel?.();
            await window.workstationBootstrap?.renderWorkstationExecutionRibbon?.();
        }});
        register("event-diagnostics", { dependencies: ["paper-trading"], start: async () => window.EventDiagnostics?.renderEventDiagnostics?.() });
    }

    window.CoreBootstrap = { register, startAll, status, renderDiagnostics, registerDefaultModules };

    document.addEventListener("DOMContentLoaded", async () => {
        registerDefaultModules();
        await startAll();
    });
})();
