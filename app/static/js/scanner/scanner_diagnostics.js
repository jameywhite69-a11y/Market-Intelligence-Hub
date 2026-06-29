function renderDiagnostics(diagnostics) {
    if (!diagnostics) {
        scannerDom.diagnosticsPanel.innerHTML =
            window.uiEmptyStates
                ? window.uiEmptyStates.renderQuietEmptyState("Scan Monitor", "Standing by")
                : "";
        return;
    }

    scannerDom.diagnosticsPanel.innerHTML = `
        <h3>Scan Monitor</h3>
        <div class="diagnostics-grid compact">
            <div><b>Execution</b><span>${diagnostics.execution_ms ?? "-"} ms</span></div>
            <div><b>Provider</b><span>${diagnostics.provider ?? "demo"}</span></div>
            <div><b>Symbols</b><span>${diagnostics.symbols?.length ?? 0}</span></div>
            <div><b>Timeframes</b><span>${diagnostics.timeframes?.join(", ") ?? "-"}</span></div>
            <div><b>Indicators</b><span>${diagnostics.indicators?.join(", ") ?? "-"}</span></div>
            <div><b>Results</b><span>${diagnostics.result_count ?? 0}</span></div>
            <div><b>Last Scan</b><span>${scannerDom.lastScanLabel?.textContent || "-"}</span></div>
            <div><b>Live</b><span>${scannerState.liveMode ? "Running" : "Paused"}</span></div>
        </div>

        <div class="scan-history compact">
            ${scannerState.scanHistory.slice(-4).reverse().map(item => `
                <div class="scan-history-row">
                    <span>${item.time}</span>
                    <span>${item.count} results</span>
                    <span>${item.ms} ms</span>
                </div>
            `).join("")}
        </div>
    `;
}

window.scannerDiagnostics = {
    renderDiagnostics,
};
