/*
Version 32.2 — Workstation Startup

This is the only file that should call scanner/workstation bootstrap functions
on DOMContentLoaded.
*/

function registerWorkstationModules() {
    if (!window.moduleRegistry) return;

    window.moduleRegistry.register("compatibility", async () => {
        if (window.workstationCompatibilityLayer?.applyCompatibilityLayer) {
            window.workstationCompatibilityLayer.applyCompatibilityLayer();
        }
    });

    window.moduleRegistry.register("watchlists", async () => {
        if (window.watchlistManager?.bootstrapWatchlists) {
            await window.watchlistManager.bootstrapWatchlists();
        } else if (window.watchlistManager?.loadWatchlists) {
            await window.watchlistManager.loadWatchlists();
        }
    });

    window.moduleRegistry.register("filters", async () => {
        window.scannerFilters?.bindFilteringAndSorting?.();
    });

    window.moduleRegistry.register("live-scan", async () => {
        window.scannerLive?.bindLiveControls?.();
        window.scannerLive?.stopLiveMode?.();
    });

    window.moduleRegistry.register("workspace-layout", async () => {
        window.workspaceLayout?.bindWorkspaceLayout?.();
    });

    window.moduleRegistry.register("workspace-intelligence", async () => {
        window.workspaceIntelligence?.renderWorkspaceIntelligence?.(
            window.scannerState?.filteredResults || []
        );
    });

    window.moduleRegistry.register("paper-trading", async () => {
        await window.paperTradingPanel?.renderPaperTradingPanel?.();
    });

    window.moduleRegistry.register("trading-terminal", async () => {
        await window.tradingTerminalPanel?.renderTradingTerminalPanel?.();
    });

    window.moduleRegistry.register("scanner", async () => {
        window.scannerOrchestrator?.bindCoreEvents?.();
        window.scannerStatus?.setStatus?.("Ready");
    });
}

document.addEventListener("DOMContentLoaded", async () => {
    registerWorkstationModules();
    await window.moduleRegistry?.start?.();
});
