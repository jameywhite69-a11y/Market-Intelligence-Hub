const scannerClient = new window.ScannerApiClient();

const scannerState = {
    currentJobId: null,
    results: [],
    diagnostics: null,
    isRunning: false,
};

const WATCHLISTS = {
    tech: ["AAPL", "MSFT", "NVDA"],
    crypto: ["BTC", "ETH", "SOL"],
};

const runButton = document.getElementById("runScanButton");
const statusBox = document.getElementById("scanStatus");
const resultsBody = document.getElementById("scannerResultsBody");
const resultCount = document.getElementById("resultCount");
const watchlistSelect = document.getElementById("watchlistSelect");
const symbolsInput = document.getElementById("symbolsInput");
const timeframesInput = document.getElementById("timeframesInput");
const indicatorsInput = document.getElementById("indicatorsInput");

function ensureDiagnosticsPanel() {
    let panel = document.getElementById("scannerDiagnostics");
    if (panel) {
        return panel;
    }

    const resultsContainer = document.querySelector(".scanner-results");
    panel = document.createElement("div");
    panel.id = "scannerDiagnostics";
    panel.className = "scanner-diagnostics";
    panel.innerHTML = "<h3>Diagnostics</h3><p>No scan has run yet.</p>";
    resultsContainer?.appendChild(panel);
    return panel;
}

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
    if (!request.symbols.length) {
        throw new Error("Enter at least one symbol.");
    }

    if (!request.timeframes.length) {
        throw new Error("Enter at least one timeframe.");
    }

    if (!request.indicators.length) {
        throw new Error("Enter at least one indicator.");
    }
}

function scoreClass(score) {
    if (score >= 80) return "score-high";
    if (score >= 60) return "score-medium";
    return "score-low";
}

function renderResults(results) {
    scannerState.results = results;
    resultCount.textContent = `${results.length} result${results.length === 1 ? "" : "s"}`;

    if (!results.length) {
        resultsBody.innerHTML = `<tr><td colspan="7" class="empty-row">No scan results returned.</td></tr>`;
        return;
    }

    resultsBody.innerHTML = results.map((result) => {
        const grade = result.tags?.[0] || "";
        const confidence = result.tags?.[1] || "";
        const warningText = result.warnings?.length ? result.warnings.join("; ") : "";
        const score = Number(result.score ?? 0);

        return `<tr>
            <td>${result.rank ?? ""}</td>
            <td>${result.symbol}</td>
            <td>${result.timeframe}</td>
            <td class="${scoreClass(score)}">${score.toFixed(1)}</td>
            <td><span class="badge badge-grade">${grade}</span></td>
            <td><span class="badge badge-confidence">${confidence}</span></td>
            <td>${warningText}</td>
        </tr>`;
    }).join("");
}

function renderDiagnostics(diagnostics) {
    const panel = ensureDiagnosticsPanel();

    if (!diagnostics) {
        panel.innerHTML = "<h3>Diagnostics</h3><p>No diagnostics available.</p>";
        return;
    }

    panel.innerHTML = `
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
    resultsBody.innerHTML = `<tr><td colspan="7" class="empty-row error-text">${error.message}</td></tr>`;
    resultCount.textContent = "0 results";
    renderDiagnostics(null);
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

        renderResults(completed.results || []);
        renderDiagnostics(completed.diagnostics || null);
        setStatus(`Completed job ${completed.job_id}`, "success");
    } catch (error) {
        console.error(error);
        renderError(error);
        setStatus("Error running scan.", "error");
    } finally {
        setLoading(false);
    }
}

watchlistSelect?.addEventListener("change", () => {
    symbolsInput.value = (WATCHLISTS[watchlistSelect.value] || []).join(",");
});

runButton?.addEventListener("click", runScanner);

if (watchlistSelect && symbolsInput) {
    symbolsInput.value = (WATCHLISTS[watchlistSelect.value] || []).join(",");
}

ensureDiagnosticsPanel();
setStatus("Ready");
