const scannerClient = new window.ScannerApiClient();

function buildScanRequest() {
    const symbols = scannerUtils.parseCsv(DOMRegistry.value("symbolsInput", ""));
    const indicators = scannerUtils.parseCsv(DOMRegistry.value("indicatorsInput", ""))
        .map(indicator => indicator.toUpperCase());

    const parameters = {};

    for (const indicator of indicators) {
        parameters[indicator] = { length: 20 };
    }

    return {
        symbols,
        timeframes: scannerUtils.parseCsv(DOMRegistry.value("timeframesInput", "")),
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
    const message = error?.message || "Unknown scanner error.";
    DOMRegistry.setHtml("scannerResultsBody", `<tr><td colspan="12" class="empty-row error-text">${message}</td></tr>`);
    DOMRegistry.setText("resultCount", "0 results");
    window.scannerDiagnostics?.renderDiagnostics?.(null);
}

function renderPortfolioIntelligence() {
    if (!window.portfolioSnapshot) return;

    const snapshot = window.portfolioSnapshot.buildLocalPortfolioSnapshot(scannerState.filteredResults || []);
    window.portfolioSnapshot.renderPortfolioCards(snapshot);
    window.opportunityQueue?.renderOpportunityQueue?.(snapshot);
    window.workspaceIntelligence?.renderWorkspaceIntelligence?.(scannerState.filteredResults || []);
}

function setScannerLoading(isLoading) {
    scannerStatus.setLoading?.(isLoading);
}

async function runScanner({ automatic = false } = {}) {
    if (scannerState.isRunning) return;

    scannerState.isRunning = true;
    setScannerLoading(true);
    scannerStatus.setStatus(automatic ? "Auto-refresh scan running..." : "Creating scan job...");

    DOMRegistry.setHtml(
        "scannerResultsBody",
        `<tr><td colspan="12" class="empty-row">${
            window.uiEmptyStates
                ? window.uiEmptyStates.renderQuietEmptyState("Scanning", "Updating ranked opportunities")
                : "Scanning..."
        }</td></tr>`
    );

    DOMRegistry.setText("resultCount", "Scanning...");

    try {
        const request = buildScanRequest();
        validateScanRequest(request);

        const job = await scannerClient.createJob(request);
        scannerState.currentJobId = job.job_id;

        scannerStatus.setStatus("Running indicators and ranking results...");

        const started = performance.now();
        const completed = await scannerClient.runJob(job.job_id);
        const elapsed = Math.round(performance.now() - started);

        scannerState.previousResults = scannerState.results || [];
        scannerState.results = completed.results || [];
        scannerState.diagnostics = completed.diagnostics || null;
        scannerState.selectedKey = null;

        scannerState.scanHistory.push({
            time: new Date().toLocaleTimeString(),
            count: scannerState.results.length,
            ms: elapsed,
        });

        DOMRegistry.setText("lastScanLabel", new Date().toLocaleTimeString());

        window.opportunityPanel?.clearOpportunityPanel?.();
        scannerFilters.applyFiltersAndSort();
        renderPortfolioIntelligence();
        window.scannerDiagnostics?.renderDiagnostics?.(scannerState.diagnostics);

        scannerStatus.setStatus(`Completed job ${completed.job_id}`);
    } catch (error) {
        console.error(error);
        renderError(error);
        scannerStatus.setStatus("Error running scan.");
        window.scannerLive?.stopLiveMode?.();
    } finally {
        scannerState.isRunning = false;
        setScannerLoading(false);
        window.scannerLive?.resetCountdown?.();
    }
}

function bindCoreEvents() {
    if (window.scannerOrchestratorEventsBound) return;
    window.scannerOrchestratorEventsBound = true;

    DOMRegistry.get("runScanButton")?.addEventListener("click", () => runScanner({ automatic: false }));
    DOMRegistry.get("exportCsvButton")?.addEventListener("click", scannerExport.exportCsv);

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
            window.opportunityPanel?.clearOpportunityPanel?.();
            scannerResults.renderResults(scannerState.filteredResults || []);
        }
    });
}

function stepSelection(direction) {
    const rows = scannerState.filteredResults || [];
    if (!rows.length) return;

    const currentIndex = rows.findIndex(row => scannerUtils.resultKey(row) === scannerState.selectedKey);
    const nextIndex = currentIndex < 0 ? 0 : Math.max(0, Math.min(rows.length - 1, currentIndex + direction));
    const next = rows[nextIndex];

    if (next) {
        scannerResults.selectResult(scannerUtils.resultKey(next));
    }
}

async function bootstrapScanner() {
    bindCoreEvents();
    scannerStatus.setStatus("Ready");
}

window.scannerOrchestrator = {
    runScanner,
    bootstrapScanner,
    bindCoreEvents,
    renderPortfolioIntelligence,
};
