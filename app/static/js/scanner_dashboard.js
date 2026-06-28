const scannerClient = new window.ScannerApiClient();

const scannerState = {
    currentJobId: null,
    results: [],
    filteredResults: [],
    diagnostics: null,
    isRunning: false,
    sortField: "rank",
    sortDirection: "asc",
    selectedKey: null,
};

const WATCHLISTS = {
    tech: ["AAPL", "MSFT", "NVDA"],
    crypto: ["BTC", "ETH", "SOL"],
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

function buildScanRequest() {
    const watchlistSymbols = WATCHLISTS[watchlistSelect.value] || [];
    const manualSymbols = parseCsv(symbolsInput.value);
    const indicators = parseCsv(indicatorsInput.value).map((item) => item.toUpperCase());

    const parameters = {};
    for (const indicator of indicators) {
        parameters[indicator] = { length: 20 };
    }

    return {
        symbols: manualSymbols.length > 0 ? manualSymbols : watchlistSymbols,
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

function applyFiltersAndSort() {
    const minScore = Number(minScoreInput?.value || 0);
    const gradeFilter = gradeFilterSelect?.value || "all";
    const confidenceFilter = confidenceFilterSelect?.value || "all";

    let rows = scannerState.results.filter((result) => {
        const score = Number(result.score ?? 0);
        const grade = gradeOf(result);
        const confidence = confidenceOf(result);

        return (
            score >= minScore &&
            (gradeFilter === "all" || grade === gradeFilter) &&
            (confidenceFilter === "all" || confidence === confidenceFilter)
        );
    });

    rows.sort((a, b) => compareResults(a, b, scannerState.sortField));

    if (scannerState.sortDirection === "desc") {
        rows.reverse();
    }

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

    if (typeof left === "number" && typeof right === "number") {
        return left - right;
    }

    return String(left).localeCompare(String(right));
}

function renderResults(results) {
    resultCount.textContent = `${results.length} result${results.length === 1 ? "" : "s"}`;

    if (!results.length) {
        resultsBody.innerHTML = `<tr><td colspan="8" class="empty-row">No matching results.</td></tr>`;
        return;
    }

    resultsBody.innerHTML = results.map((result) => {
        const grade = gradeOf(result);
        const confidence = confidenceOf(result);
        const warningText = result.warnings?.length ? result.warnings.join("; ") : "";
        const score = Number(result.score ?? 0);
        const key = resultKey(result);
        const selected = key === scannerState.selectedKey ? "selected-row" : "";

        return `<tr class="${selected}" data-key="${key}">
            <td>${result.rank ?? ""}</td>
            <td class="symbol-cell">${result.symbol}</td>
            <td>${result.timeframe}</td>
            <td class="${scoreClass(score)}">${score.toFixed(1)}</td>
            <td><span class="badge badge-grade grade-${grade.replace("+", "plus")}">${grade}</span></td>
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

    const indicatorList = Object.entries(result.indicator_results || {})
        .map(([name, payload]) => {
            const values = payload.values || {};
            const valueText = Object.entries(values)
                .map(([key, value]) => `${key}: ${Number(value).toFixed ? Number(value).toFixed(2) : value}`)
                .join(", ");

            return `<li><b>${name}</b><span>${valueText || "Result available"}</span></li>`;
        })
        .join("");

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
            ${indicatorList || "<li>No indicator output.</li>"}
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
        </div>
    `;
}

function renderError(error) {
    resultsBody.innerHTML = `<tr><td colspan="8" class="empty-row error-text">${error.message}</td></tr>`;
    resultCount.textContent = "0 results";
    diagnosticsPanel.innerHTML = "<h3>Diagnostics</h3><p>No diagnostics available.</p>";
}

async function runScanner() {
    if (scannerState.isRunning) return;

    setLoading(true);
    setStatus("Creating scan job...", "loading");

    try {
        const request = buildScanRequest();
        validateScanRequest(request);

        const job = await scannerClient.createJob(request);
        scannerState.currentJobId = job.job_id;

        setStatus("Running indicators and ranking results...", "loading");

        const completed = await scannerClient.runJob(job.job_id);

        scannerState.results = completed.results || [];
        scannerState.diagnostics = completed.diagnostics || null;
        scannerState.selectedKey = null;

        applyFiltersAndSort();
        renderDiagnostics(scannerState.diagnostics);
        setStatus(`Completed job ${completed.job_id}`, "success");
    } catch (error) {
        console.error(error);
        renderError(error);
        setStatus("Error running scan.", "error");
    } finally {
        setLoading(false);
    }
}

function exportCsv() {
    const rows = scannerState.filteredResults.length ? scannerState.filteredResults : scannerState.results;
    if (!rows.length) {
        setStatus("No results to export.", "error");
        return;
    }

    const headers = ["rank", "symbol", "timeframe", "score", "grade", "confidence", "status"];
    const csvRows = [
        headers.join(","),
        ...rows.map((result) => [
            result.rank ?? "",
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

watchlistSelect?.addEventListener("change", () => {
    symbolsInput.value = (WATCHLISTS[watchlistSelect.value] || []).join(",");
});

for (const control of [minScoreInput, gradeFilterSelect, confidenceFilterSelect]) {
    control?.addEventListener("input", applyFiltersAndSort);
    control?.addEventListener("change", applyFiltersAndSort);
}

runButton?.addEventListener("click", runScanner);
exportButton?.addEventListener("click", exportCsv);

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

if (watchlistSelect && symbolsInput) {
    symbolsInput.value = (WATCHLISTS[watchlistSelect.value] || []).join(",");
}

bindSorting();
setStatus("Ready");
