const scannerClient = new window.ScannerApiClient();

const scannerState = {
    currentJobId: null,
    results: [],
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

function parseCsv(value) {
    return value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
}

function setStatus(message, type = "ready") {
    statusBox.textContent = `Status: ${message}`;
    statusBox.dataset.status = type;
}

function setLoading(isLoading) {
    runButton.disabled = isLoading;
    runButton.textContent = isLoading ? "Scanning..." : "Run Scan";
}

function buildScanRequest() {
    const watchlistKey = watchlistSelect.value;
    const watchlistSymbols = WATCHLISTS[watchlistKey] || [];
    const manualSymbols = parseCsv(symbolsInput.value);
    const symbols = manualSymbols.length > 0 ? manualSymbols : watchlistSymbols;

    const indicators = parseCsv(indicatorsInput.value).map((item) => item.toUpperCase());

    const parameters = {};
    for (const indicator of indicators) {
        parameters[indicator] = { length: 20 };
    }

    return {
        symbols,
        timeframes: parseCsv(timeframesInput.value),
        indicators,
        parameters,
    };
}

function renderResults(results) {
    scannerState.results = results;
    resultCount.textContent = `${results.length} result${results.length === 1 ? "" : "s"}`;

    if (!results.length) {
        resultsBody.innerHTML = `
            <tr>
                <td colspan="7" class="empty-row">No scan results returned.</td>
            </tr>
        `;
        return;
    }

    resultsBody.innerHTML = results
        .map((result) => {
            const grade = result.tags?.[0] || "";
            const confidence = result.tags?.[1] || "";
            const warningText = result.warnings?.length ? result.warnings.join("; ") : "";

            return `
                <tr>
                    <td>${result.rank ?? ""}</td>
                    <td>${result.symbol}</td>
                    <td>${result.timeframe}</td>
                    <td>${Number(result.score ?? 0).toFixed(1)}</td>
                    <td><span class="badge badge-grade">${grade}</span></td>
                    <td><span class="badge badge-confidence">${confidence}</span></td>
                    <td>${warningText}</td>
                </tr>
            `;
        })
        .join("");
}

function renderError(error) {
    resultsBody.innerHTML = `
        <tr>
            <td colspan="7" class="empty-row error-text">${error.message}</td>
        </tr>
    `;
    resultCount.textContent = "0 results";
}

async function runScanner() {
    setLoading(true);
    setStatus("Creating scan job...", "loading");

    try {
        const scanRequest = buildScanRequest();
        const job = await scannerClient.createJob(scanRequest);

        scannerState.currentJobId = job.job_id;
        setStatus(`Running job ${job.job_id}...`, "loading");

        const completed = await scannerClient.runJob(job.job_id);

        renderResults(completed.results || []);
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
    const symbols = WATCHLISTS[watchlistSelect.value] || [];
    symbolsInput.value = symbols.join(",");
});

runButton?.addEventListener("click", runScanner);

if (watchlistSelect && symbolsInput) {
    symbolsInput.value = (WATCHLISTS[watchlistSelect.value] || []).join(",");
}

setStatus("Ready");