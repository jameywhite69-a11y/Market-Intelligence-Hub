/*
Version 35.0 — Pipeline Subscribers
All UI refreshes subscribe to scanner lifecycle events.
*/

(function () {
    function renderError(error) {
        const message = error?.message || "Unknown scanner error.";
        DOMRegistry.setHtml(
            "scannerResultsBody",
            `<tr><td colspan="12" class="empty-row error-text">${message}</td></tr>`
        );
        DOMRegistry.setText("resultCount", "0 results");
        window.scannerDiagnostics?.renderDiagnostics?.(null);
    }

    function renderPortfolioIntelligence() {
        if (!window.portfolioSnapshot) return;

        const snapshot = window.portfolioSnapshot.buildLocalPortfolioSnapshot(
            scannerState.filteredResults || []
        );

        window.portfolioSnapshot.renderPortfolioCards(snapshot);
        window.opportunityQueue?.renderOpportunityQueue?.(snapshot);
        window.workspaceIntelligence?.renderWorkspaceIntelligence?.(
            scannerState.filteredResults || []
        );
    }

    function registerPipelineSubscribers() {
        if (window.pipelineSubscribersRegistered) return;
        window.pipelineSubscribersRegistered = true;

        EventBus.subscribe("scan:completed", payload => {
            window.opportunityPanel?.clearOpportunityPanel?.();

            if (window.scannerFilters?.applyFiltersAndSort) {
                window.scannerFilters.applyFiltersAndSort();
            } else {
                window.scannerResults?.renderResults?.(scannerState.filteredResults || []);
            }

            renderPortfolioIntelligence();
            window.scannerDiagnostics?.renderDiagnostics?.(payload.diagnostics);
            window.tradingTerminalPanel?.renderTradingTerminalPanel?.();
            window.paperTradingPanel?.renderPaperTradingPanel?.();
        });

        EventBus.subscribe("scan:failed", payload => {
            renderError(payload.error);
        });

        EventBus.subscribe("trade-selected", context => {
            window.TradeContextPanel?.renderTradeContextPanel?.(context);
            window.OrderTicket?.renderOrderTicket?.(context);
        });

        EventBus.subscribe("paper-order-filled", () => {
            window.tradingTerminalPanel?.renderTradingTerminalPanel?.();
            window.paperTradingPanel?.renderPaperTradingPanel?.();
            window.workstationBootstrap?.renderWorkstationExecutionRibbon?.();
        });
    }

    window.PipelineSubscribers = {
        registerPipelineSubscribers,
        renderPortfolioIntelligence,
    };
})();
