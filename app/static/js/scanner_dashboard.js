const scannerClient = new window.ScannerApiClient();
const watchlistClient = new window.WatchlistApiClient();

const scannerState = {
    currentJobId: null,
    results: [],
    previousResults: [],
    filteredResults: [],
    diagnostics: null,
    isRunning: false,
    sortField: "rank",
    sortDirection: "asc",
    selectedKey: null,
    watchlists: [],
    activeWatchlist: null,
    liveMode: false,
    refreshIntervalSeconds: 30,
    countdownSeconds: 30,
    refreshTimerId: null,
    countdownTimerId: null,
    scanHistory: [],
};

const runButton = document.getElementById("runScanButton");
const exportButton = document.getElementById("exportCsvButton");
const statusBox = document.getElementById("scanStatus");
const resultsBody = document.getElementById("scannerResultsBody");
const resultCount = document.getElementById("resultCount");
const watchlistSelect = document.getElementById("watchlistSelect");
const symbolsInput = document.getElementById("symbolsInput");
const timeframesInput = document.getElementById("timeframesInput");
const indicatorsInput = document.getElementById("indicatorsInput");
const minScoreInput = document.getElementById("minScoreInput");
const gradeFilterSelect = document.getElementById("gradeFilterSelect");
const confidenceFilterSelect = document.getElementById("confidenceFilterSelect");
const opportunityPanel = document.getElementById("opportunityPanel");
const diagnosticsPanel = document.getElementById("scannerDiagnostics");

const newWatchlistName = document.getElementById("newWatchlistName");
const createWatchlistButton = document.getElementById("createWatchlistButton");
const deleteWatchlistButton = document.getElementById("deleteWatchlistButton");
const addSymbolInput = document.getElementById("addSymbolInput");
const addSymbolButton = document.getElementById("addSymbolButton");
const watchlistSymbols = document.getElementById("watchlistSymbols");
const exportWatchlistButton = document.getElementById("exportWatchlistButton");
const importSymbolsInput = document.getElementById("importSymbolsInput");

const liveModeButton = document.getElementById("liveModeButton");
const pauseLiveButton = document.getElementById("pauseLiveButton");
const refreshIntervalSelect = document.getElementById("refreshIntervalSelect");
const countdownLabel = document.getElementById("countdownLabel");
const lastScanLabel = document.getElementById("lastScanLabel");

function parseCsv(value) {
    return value.split(",").map((item) => item.trim()).filter(Boolean);
}

function setStatus(message, type = "ready") {
    statusBox.textContent = `Status: ${message}`;
    statusBox.dataset.status = type;
}

function setLoading(isLoading) {
    scannerState.isRunning = isLoading;
    runButton.disabled = isLoading;
    runButton.textContent = isLoading ? "Scanning..." : "Run Scan";
}

function activeWatchlist() {
    return scannerState.watchlists.find((watchlist) => watchlist.name === watchlistSelect.value) || null;
}

async function loadWatchlists() {
    let payload = await watchlistClient.list();

    if (!payload.watchlists.length) {
        payload = await watchlistClient.seed();
    }

    scannerState.watchlists = payload.watchlists || [];
    renderWatchlistSelector();
    renderActiveWatchlist();
}

function renderWatchlistSelector() {
    watchlistSelect.innerHTML = scannerState.watchlists
        .map((watchlist) => `<option value="${watchlist.name}">${watchlist.name}</option>`)
        .join("");

    if (scannerState.watchlists.length && !watchlistSelect.value) {
        watchlistSelect.value = scannerState.watchlists[0].name;
    }
}

function renderActiveWatchlist() {
    const watchlist = activeWatchlist();
    scannerState.activeWatchlist = watchlist;

    if (!watchlist) {
        symbolsInput.value = "";
        watchlistSymbols.innerHTML = `<div class="empty-row">No watchlist selected.</div>`;
        return;
    }

    symbolsInput.value = (watchlist.symbols || []).join(",");

    if (!watchlist.symbols?.length) {
        watchlistSymbols.innerHTML = `<div class="empty-row">No symbols yet.</div>`;
        return;
    }

    watchlistSymbols.innerHTML = watchlist.symbols
        .map((symbol) => `
            <div class="watchlist-symbol-pill">
                <span>${symbol}</span>
                <button data-remove-symbol="${symbol}">×</button>
            </div>
        `)
        .join("");

    for (const button of watchlistSymbols.querySelectorAll("[data-remove-symbol]")) {
        button.addEventListener("click", async () => {
            await watchlistClient.removeSymbol(watchlist.name, button.dataset.removeSymbol);
            await loadWatchlists();
        });
    }
}

async function createWatchlist() {
    const name = newWatchlistName.value.trim();
    if (!name) {
        setStatus("Enter a watchlist name.", "error");
        return;
    }

    await watchlistClient.create({ name, symbols: [], description: "" });
    newWatchlistName.value = "";
    await loadWatchlists();
    watchlistSelect.value = name;
    renderActiveWatchlist();
    setStatus(`Created watchlist ${name}.`, "success");
}

async function deleteActiveWatchlist() {
    const watchlist = activeWatchlist();
    if (!watchlist) return;

    await watchlistClient.remove(watchlist.name);
    await loadWatchlists();
    setStatus(`Deleted watchlist ${watchlist.name}.`, "success");
}

async function addSymbolToActiveWatchlist() {
    const watchlist = activeWatchlist();
    const symbol = addSymbolInput.value.trim();

    if (!watchlist || !symbol) {
        setStatus("Select a watchlist and enter a symbol.", "error");
        return;
    }

    await watchlistClient.addSymbol(watchlist.name, symbol);
    addSymbolInput.value = "";
    await loadWatchlists();
    setStatus(`Added ${symbol.toUpperCase()} to ${watchlist.name}.`, "success");
}

function exportActiveWatchlist() {
    const watchlist = activeWatchlist();
    if (!watchlist) {
        setStatus("No watchlist selected.", "error");
        return;
    }

    const blob = new Blob([(watchlist.symbols || []).join("\n")], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");

    anchor.href = url;
    anchor.download = `${watchlist.name}_watchlist.txt`;
    anchor.click();

    URL.revokeObjectURL(url);
    setStatus("Watchlist exported.", "success");
}

async function importSymbolsToActiveWatchlist() {
    const watchlist = activeWatchlist();
    if (!watchlist) {
        setStatus("No watchlist selected.", "error");
        return;
    }

    const symbols = parseCsv(importSymbolsInput.value.replaceAll("\n", ","));

    for (const symbol of symbols) {
        await watchlistClient.addSymbol(watchlist.name, symbol);
    }

    importSymbolsInput.value = "";
    await loadWatchlists();
    setStatus(`Imported ${symbols.length} symbols.`, "success");
}

function buildScanRequest() {
    const manualSymbols = parseCsv(symbolsInput.value);
    const indicators = parseCsv(indicatorsInput.value).map((item) => item.toUpperCase());

    const parameters = {};
    for (const indicator of indicators) {
        parameters[indicator] = { length: 20 };
    }

    return {
        symbols: manualSymbols,
        timeframes: parseCsv(timeframesInput.value),
        indicators,
        parameters,
    };
}

function validateScanRequest(request) {
    if (!request.symbols.length) throw new Error("Enter at least one symbol.");
    if (!request.timeframes.length) throw new Error("Enter at least one timeframe.");
    if (!request.indicators.length) throw new Error("Enter at least one indicator.");
}

function resultKey(result) {
    return `${result.symbol}:${result.timeframe}`;
}

function gradeOf(result) {
    return result.tags?.[0] || "";
}

function confidenceOf(result) {
    return result.tags?.[1] || "";
}

function statusOf(result) {
    const score = Number(result.score ?? 0);
    if (score >= 80) return "Ready";
    if (score >= 60) return "Watch";
    return "Avoid";
}

function scoreClass(score) {
    if (score >= 80) return "score-high";
    if (score >= 60) return "score-medium";
    return "score-low";
}

function rankChangeOf(result) {
    const previous = scannerState.previousResults.find((item) => resultKey(item) === resultKey(result));
    if (!previous || previous.rank === null || result.rank === null) return "new";
    if (result.rank < previous.rank) return "up";
    if (result.rank > previous.rank) return "down";
    return "flat";
}

function rankChangeLabel(change) {
    const labels = {
        new: "NEW",
        up: "▲",
        down: "▼",
        flat: "—",
    };
    return labels[change] || "—";
}

function applyFiltersAndSort() {
    const minScore = Number(minScoreInput?.value || 0);
    const gradeFilter = gradeFilterSelect?.value || "all";
    const confidenceFilter = confidenceFilterSelect?.value || "all";

    let rows = scannerState.results.filter((result) => {
        const score = Number(result.score ?? 0);
        return (
            score >= minScore &&
            (gradeFilter === "all" || gradeOf(result) === gradeFilter) &&
            (confidenceFilter === "all" || confidenceOf(result) === confidenceFilter)
        );
    });

    rows.sort((a, b) => compareResults(a, b, scannerState.sortField));
    if (scannerState.sortDirection === "desc") rows.reverse();

    scannerState.filteredResults = rows;
    renderResults(rows);
}

function compareResults(a, b, field) {
    const accessors = {
        rank: (row) => Number(row.rank ?? 0),
        symbol: (row) => row.symbol || "",
        timeframe: (row) => row.timeframe || "",
        score: (row) => Number(row.score ?? 0),
        grade: (row) => gradeOf(row),
        confidence: (row) => confidenceOf(row),
    };

    const getter = accessors[field] || accessors.rank;
    const left = getter(a);
    const right = getter(b);

    if (typeof left === "number" && typeof right === "number") return left - right;
    return String(left).localeCompare(String(right));
}

function renderResults(results) {
    resultCount.textContent = `${results.length} result${results.length === 1 ? "" : "s"}`;

    if (!results.length) {
        resultsBody.innerHTML = `<tr><td colspan="9" class="empty-row">No matching results.</td></tr>`;
        return;
    }

    resultsBody.innerHTML = results.map((result) => {
        const grade = gradeOf(result);
        const confidence = confidenceOf(result);
        const warningText = result.warnings?.length ? result.warnings.join("; ") : "";
        const score = Number(result.score ?? 0);
        const key = resultKey(result);
        const selected = key === scannerState.selectedKey ? "selected-row" : "";
        const change = rankChangeOf(result);
        const changeClass = `rank-${change}`;

        return `<tr class="${selected} ${change === "new" ? "new-opportunity-row" : ""}" data-key="${key}">
            <td>${result.rank ?? ""}</td>
            <td class="${changeClass}">${rankChangeLabel(change)}</td>
            <td class="symbol-cell">${result.symbol}</td>
            <td>${result.timeframe}</td>
            <td class="${scoreClass(score)}">${score.toFixed(1)}</td>
            <td><span class="badge badge-grade">${grade}</span></td>
            <td><span class="badge badge-confidence">${confidence}</span></td>
            <td><span class="status-pill status-${statusOf(result).toLowerCase()}">${statusOf(result)}</span></td>
            <td>${warningText}</td>
        </tr>`;
    }).join("");

    for (const row of resultsBody.querySelectorAll("tr[data-key]")) {
        row.addEventListener("click", () => selectResult(row.dataset.key));
    }
}

function selectResult(key) {
    scannerState.selectedKey = key;
    const result = scannerState.results.find((item) => resultKey(item) === key);
    if (!result) return;

    renderOpportunityPanel(result);
    renderResults(scannerState.filteredResults);
}

function renderOpportunityPanel(result) {
    const score = Number(result.score ?? 0);
    opportunityPanel.innerHTML = `
        <h2>${result.symbol}</h2>
        <div class="inspector-subtitle">${result.timeframe}</div>
        <div class="inspector-score ${scoreClass(score)}">${score.toFixed(1)}</div>
        <div class="inspector-badges">
            <span class="badge badge-grade">${gradeOf(result)}</span>
            <span class="badge badge-confidence">${confidenceOf(result)}</span>
            <span class="status-pill status-${statusOf(result).toLowerCase()}">${statusOf(result)}</span>
        </div>
        <h3>Indicator Output</h3>
        <ul class="indicator-output">
            ${Object.keys(result.indicator_results || {}).map((name) => `<li><b>${name}</b><span>Result available</span></li>`).join("")}
        </ul>
    `;
}

function renderDiagnostics(diagnostics) {
    if (!diagnostics) {
        diagnosticsPanel.innerHTML = "<h3>Diagnostics</h3><p>No diagnostics available.</p>";
        return;
    }

    diagnosticsPanel.innerHTML = `
        <h3>Diagnostics</h3>
        <div class="diagnostics-grid">
            <div><b>Execution</b><span>${diagnostics.execution_ms ?? "-"} ms</span></div>
            <div><b>Provider</b><span>${diagnostics.provider ?? "demo"}</span></div>
            <div><b>Symbols</b><span>${diagnostics.symbols?.length ?? 0}</span></div>
            <div><b>Timeframes</b><span>${diagnostics.timeframes?.join(", ") ?? "-"}</span></div>
            <div><b>Indicators</b><span>${diagnostics.indicators?.join(", ") ?? "-"}</span></div>
            <div><b>Results</b><span>${diagnostics.result_count ?? 0}</span></div>
            <div><b>Last Scan</b><span>${lastScanLabel?.textContent || "-"}</span></div>
            <div><b>Live Mode</b><span>${scannerState.liveMode ? "Running" : "Paused"}</span></div>
        </div>
        <h3>Scan History</h3>
        <div class="scan-history">
            ${scannerState.scanHistory.slice(-5).reverse().map((item) => `
                <div class="scan-history-row">
                    <span>${item.time}</span>
                    <span>${item.count} results</span>
                    <span>${item.ms} ms</span>
                </div>
            `).join("") || "<p>No scan history yet.</p>"}
        </div>
    `;
}

function renderError(error) {
    resultsBody.innerHTML = `<tr><td colspan="9" class="empty-row error-text">${error.message}</td></tr>`;
    resultCount.textContent = "0 results";
    diagnosticsPanel.innerHTML = "<h3>Diagnostics</h3><p>No diagnostics available.</p>";
}

async function runScanner({ automatic = false } = {}) {
    if (scannerState.isRunning) return;

    setLoading(true);
    setStatus(automatic ? "Auto-refresh scan running..." : "Creating scan job...", "loading");

    try {
        const request = buildScanRequest();
        validateScanRequest(request);

        const job = await scannerClient.createJob(request);
        scannerState.currentJobId = job.job_id;

        setStatus("Running indicators and ranking results...", "loading");

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

        if (lastScanLabel) {
            lastScanLabel.textContent = new Date().toLocaleTimeString();
        }

        applyFiltersAndSort();
        renderDiagnostics(scannerState.diagnostics);
        setStatus(`Completed job ${completed.job_id}`, "success");
    } catch (error) {
        console.error(error);
        renderError(error);
        setStatus("Error running scan.", "error");
        stopLiveMode();
    } finally {
        setLoading(false);
        resetCountdown();
    }
}

function exportCsv() {
    const rows = scannerState.filteredResults.length ? scannerState.filteredResults : scannerState.results;
    if (!rows.length) {
        setStatus("No results to export.", "error");
        return;
    }

    const headers = ["rank", "change", "symbol", "timeframe", "score", "grade", "confidence", "status"];
    const csvRows = [
        headers.join(","),
        ...rows.map((result) => [
            result.rank ?? "",
            rankChangeLabel(rankChangeOf(result)),
            result.symbol,
            result.timeframe,
            Number(result.score ?? 0).toFixed(1),
            gradeOf(result),
            confidenceOf(result),
            statusOf(result),
        ].map((value) => `"${String(value).replaceAll('"', '""')}"`).join(",")),
    ];

    const blob = new Blob([csvRows.join("\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");

    anchor.href = url;
    anchor.download = `scanner_results_${new Date().toISOString().replaceAll(":", "-")}.csv`;
    anchor.click();

    URL.revokeObjectURL(url);
    setStatus("CSV exported.", "success");
}

function bindSorting() {
    for (const header of document.querySelectorAll("[data-sort]")) {
        header.addEventListener("click", () => {
            const field = header.dataset.sort;
            if (scannerState.sortField === field) {
                scannerState.sortDirection = scannerState.sortDirection === "asc" ? "desc" : "asc";
            } else {
                scannerState.sortField = field;
                scannerState.sortDirection = field === "score" ? "desc" : "asc";
            }
            applyFiltersAndSort();
        });
    }
}

function resetCountdown() {
    scannerState.countdownSeconds = scannerState.refreshIntervalSeconds;
    updateCountdownLabel();
}

function updateCountdownLabel() {
    if (!countdownLabel) return;
    countdownLabel.textContent = scannerState.liveMode
        ? `Next scan in ${scannerState.countdownSeconds}s`
        : "Live scanning paused";
}

function startLiveMode() {
    scannerState.liveMode = true;
    scannerState.refreshIntervalSeconds = Number(refreshIntervalSelect?.value || 30);
    resetCountdown();

    clearInterval(scannerState.refreshTimerId);
    clearInterval(scannerState.countdownTimerId);

    scannerState.countdownTimerId = setInterval(() => {
        scannerState.countdownSeconds = Math.max(0, scannerState.countdownSeconds - 1);
        updateCountdownLabel();
    }, 1000);

    scannerState.refreshTimerId = setInterval(() => {
        runScanner({ automatic: true });
    }, scannerState.refreshIntervalSeconds * 1000);

    liveModeButton.disabled = true;
    pauseLiveButton.disabled = false;
    setStatus("Live scanning started.", "success");
}

function stopLiveMode() {
    scannerState.liveMode = false;
    clearInterval(scannerState.refreshTimerId);
    clearInterval(scannerState.countdownTimerId);
    scannerState.refreshTimerId = null;
    scannerState.countdownTimerId = null;

    if (liveModeButton) liveModeButton.disabled = false;
    if (pauseLiveButton) pauseLiveButton.disabled = true;

    updateCountdownLabel();
}

watchlistSelect?.addEventListener("change", renderActiveWatchlist);
createWatchlistButton?.addEventListener("click", createWatchlist);
deleteWatchlistButton?.addEventListener("click", deleteActiveWatchlist);
addSymbolButton?.addEventListener("click", addSymbolToActiveWatchlist);
exportWatchlistButton?.addEventListener("click", exportActiveWatchlist);
importSymbolsInput?.addEventListener("change", importSymbolsToActiveWatchlist);

for (const control of [minScoreInput, gradeFilterSelect, confidenceFilterSelect]) {
    control?.addEventListener("input", applyFiltersAndSort);
    control?.addEventListener("change", applyFiltersAndSort);
}

runButton?.addEventListener("click", () => runScanner({ automatic: false }));
exportButton?.addEventListener("click", exportCsv);
liveModeButton?.addEventListener("click", startLiveMode);
pauseLiveButton?.addEventListener("click", stopLiveMode);
refreshIntervalSelect?.addEventListener("change", () => {
    scannerState.refreshIntervalSeconds = Number(refreshIntervalSelect.value || 30);
    resetCountdown();
    if (scannerState.liveMode) {
        stopLiveMode();
        startLiveMode();
    }
});

document.addEventListener("keydown", (event) => {
    if (event.ctrlKey && event.key.toLowerCase() === "e") {
        event.preventDefault();
        exportCsv();
    }

    if (event.key === "Escape") {
        scannerState.selectedKey = null;
        opportunityPanel.innerHTML = `<h2>Opportunity Inspector</h2><p class="muted">Select a result to inspect score, grade, confidence, and indicator output.</p>`;
        renderResults(scannerState.filteredResults);
    }
});

bindSorting();
loadWatchlists();
stopLiveMode();
setStatus("Ready");
