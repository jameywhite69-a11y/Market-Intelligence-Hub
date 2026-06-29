/*
Version 33.0 — Core Bootstrap

Dependency-aware startup for /scanner and /workstation.
*/

(function () {
    const modules = new Map();
    let started = false;

    function register(name, options) {
        modules.set(name, {
            name,
            dependencies: options.dependencies || [],
            start: options.start || (async () => {}),
            started: false,
            skipped: false,
            error: null,
        });
    }

    function canStart(module) {
        return module.dependencies.every(name => modules.get(name)?.started);
    }

    async function startAll() {
        if (started) {
            console.info("Core bootstrap already started");
            return;
        }

        started = true;

        let progress = true;

        while (progress) {
            progress = false;

            for (const module of modules.values()) {
                if (module.started || module.skipped || module.error) continue;
                if (!canStart(module)) continue;

                try {
                    await module.start();
                    module.started = true;
                    progress = true;
                    console.info(`Core module started: ${module.name}`);
                } catch (error) {
                    module.error = error;
                    console.error(`Core module failed: ${module.name}`, error);
                    progress = true;
                }
            }
        }

        for (const module of modules.values()) {
            if (!module.started && !module.error) {
                module.skipped = true;
                console.warn(`Core module skipped: ${module.name}`, module.dependencies);
            }
        }

        renderDiagnostics();
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
        register("dom", {
            start: async () => {
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
            },
        });

        register("compatibility", {
            dependencies: ["dom"],
            start: async () => {
                window.workstationCompatibilityLayer?.applyCompatibilityLayer?.();
            },
        });

        register("watchlists", {
            dependencies: ["compatibility"],
            start: async () => {
                if (window.watchlistManager?.bootstrapWatchlists) {
                    await window.watchlistManager.bootstrapWatchlists();
                } else if (window.watchlistManager?.loadWatchlists) {
                    await window.watchlistManager.loadWatchlists();
                }
            },
        });

        register("scanner-events", {
            dependencies: ["compatibility"],
            start: async () => {
                window.scannerOrchestrator?.bindCoreEvents?.();
                window.scannerStatus?.setStatus?.("Ready");
            },
        });

        register("filters", {
            dependencies: ["compatibility"],
            start: async () => {
                window.scannerFilters?.bindFilteringAndSorting?.();
            },
        });

        register("live-scan", {
            dependencies: ["compatibility"],
            start: async () => {
                window.scannerLive?.bindLiveControls?.();
                window.scannerLive?.stopLiveMode?.();
            },
        });

        register("workspace-intelligence", {
            dependencies: ["watchlists"],
            start: async () => {
                window.workspaceLayout?.bindWorkspaceLayout?.();
                window.workspaceIntelligence?.renderWorkspaceIntelligence?.(
                    window.scannerState?.filteredResults || []
                );
            },
        });

        register("paper-trading", {
            dependencies: ["compatibility"],
            start: async () => {
                await window.paperTradingPanel?.renderPaperTradingPanel?.();
                await window.tradingTerminalPanel?.renderTradingTerminalPanel?.();
                await window.workstationBootstrap?.renderWorkstationExecutionRibbon?.();
            },
        });
    }

    window.CoreBootstrap = {
        register,
        startAll,
        status,
        renderDiagnostics,
        registerDefaultModules,
    };

    document.addEventListener("DOMContentLoaded", async () => {
        registerDefaultModules();
        await startAll();
    });
})();
