const scannerClient = new window.ScannerApiClient();

function buildScanRequest() {
    const symbols = scannerUtils.parseCsv(scannerDom.symbolsInput.value);
    const indicators = scannerUtils.parseCsv(scannerDom.indicatorsInput.value)
        .map(indicator => indicator.toUpperCase());

    const parameters = {};

    for (const indicator of indicators) {
        parameters[indicator] = { length: 20 };
    }

    return {
        symbols,
        timeframes: scannerUtils.parseCsv(scannerDom.timeframesInput.value),
        indicators,
        parameters,
    };
}

function validateScanRequest(request) {
    if (!request.symbols.length) throw new Error("Enter at least one symbol.");
    if (!request.timeframes.length) throw new Error("Enter at least one timeframe.");
    if (!request.indicators.length) throw new Error("Enter at least one indicator.");
}

function renderError(error) {
    scannerDom.resultsBody.innerHTML =
        `<tr><td colspan="11" class="empty-row error-text">${error.message}</td></tr>`;
    scannerDom.resultCount.textContent = "0 results";
    scannerDiagnostics.renderDiagnostics(null);
}

function renderPortfolioIntelligence() {
    if (!window.portfolioSnapshot) return;

    const snapshot = window.portfolioSnapshot.buildLocalPortfolioSnapshot(scannerState.filteredResults);

    window.portfolioSnapshot.renderPortfolioCards(snapshot);

    if (window.opportunityQueue) {
        window.opportunityQueue.renderOpportunityQueue(snapshot);
    }

    if (window.workspaceIntelligence) {
        window.workspaceIntelligence.renderWorkspaceIntelligence(scannerState.filteredResults);
    }
}

async function runScanner({ automatic = false } = {}) {
    if (scannerState.isRunning) return;

    scannerStatus.setLoading(true);
    scannerStatus.setStatus(
        automatic ? "Auto-refresh scan running..." : "Creating scan job...",
        "loading"
    );

    try {
        const request = buildScanRequest();
        validateScanRequest(request);

        const job = await scannerClient.createJob(request);
        scannerState.currentJobId = job.job_id;

        scannerStatus.setStatus("Running indicators and ranking results...", "loading");

        const started = performance.now();
        const completed = await scannerClient.runJob(job.job_id);
        const elapsed = Math.round(performance.now() - started);

        scannerState.previousResults = scannerState.results;
        scannerState.results = completed.results || [];
        scannerState.diagnostics = completed.diagnostics || null;
        scannerState.selectedKey = null;

        scannerState.scanHistory.push({
            time: new Date().toLocaleTimeString(),
            count: scannerState.results.length,
            ms: elapsed,
        });

        if (scannerDom.lastScanLabel) {
            scannerDom.lastScanLabel.textContent = new Date().toLocaleTimeString();
        }

        if (window.opportunityPanel) {
            window.opportunityPanel.clearOpportunityPanel();
        }

        scannerFilters.applyFiltersAndSort();
        renderPortfolioIntelligence();
        scannerDiagnostics.renderDiagnostics(scannerState.diagnostics);
        scannerStatus.setStatus(`Completed job ${completed.job_id}`, "success");
    } catch (error) {
        console.error(error);
        renderError(error);
        scannerStatus.setStatus("Error running scan.", "error");
        scannerLive.stopLiveMode();
    } finally {
        scannerStatus.setLoading(false);
        scannerLive.resetCountdown();
    }
}

function bindCoreEvents() {
    scannerDom.runButton?.addEventListener("click", () => runScanner({ automatic: false }));
    scannerDom.exportButton?.addEventListener("click", scannerExport.exportCsv);

    document.addEventListener("keydown", event => {
        if (event.ctrlKey && event.key.toLowerCase() === "e") {
            event.preventDefault();
            scannerExport.exportCsv();
        }

        if (event.altKey && event.key === "ArrowDown") {
            event.preventDefault();
            stepSelection(1);
        }

        if (event.altKey && event.key === "ArrowUp") {
            event.preventDefault();
            stepSelection(-1);
        }

        if (event.key === "Escape") {
            scannerState.selectedKey = null;

            if (window.opportunityPanel) {
                window.opportunityPanel.clearOpportunityPanel();
            }

            scannerResults.renderResults(scannerState.filteredResults);
        }
    });
}

function stepSelection(direction) {
    const rows = scannerState.filteredResults || [];
    if (!rows.length) return;

    const currentIndex = rows.findIndex(row => scannerUtils.resultKey(row) === scannerState.selectedKey);
    const nextIndex = Math.max(0, Math.min(rows.length - 1, currentIndex + direction));
    const next = rows[nextIndex < 0 ? 0 : nextIndex];

    if (next) {
        scannerResults.selectResult(scannerUtils.resultKey(next));
    }
}

function bootstrapScanner() {
    bindCoreEvents();

    watchlistManager.bindWatchlistEvents();
    scannerFilters.bindFilteringAndSorting();
    scannerLive.bindLiveControls();

    if (window.workspaceLayout) {
        window.workspaceLayout.bindWorkspaceLayout();
    }

    watchlistManager.loadWatchlists().then(() => {
        if (window.workspaceIntelligence) {
            window.workspaceIntelligence.renderWorkspaceIntelligence(scannerState.filteredResults || []);
        }
    });

    scannerLive.stopLiveMode();

    scannerStatus.setStatus("Ready");
}

window.scannerOrchestrator = {
    runScanner,
    bootstrapScanner,
    renderPortfolioIntelligence,
};

document.addEventListener("DOMContentLoaded", bootstrapScanner);
