function renderDiagnostics(diagnostics) {
    if (!diagnostics) {
        scannerDom.diagnosticsPanel.innerHTML =
            "<h3>Diagnostics</h3><p>No diagnostics available.</p>";
        return;
    }

    scannerDom.diagnosticsPanel.innerHTML = `
        <h3>Diagnostics</h3>
        <div class="diagnostics-grid">
            <div><b>Execution</b><span>${diagnostics.execution_ms ?? "-"} ms</span></div>
            <div><b>Provider</b><span>${diagnostics.provider ?? "demo"}</span></div>
            <div><b>Symbols</b><span>${diagnostics.symbols?.length ?? 0}</span></div>
            <div><b>Timeframes</b><span>${diagnostics.timeframes?.join(", ") ?? "-"}</span></div>
            <div><b>Indicators</b><span>${diagnostics.indicators?.join(", ") ?? "-"}</span></div>
            <div><b>Results</b><span>${diagnostics.result_count ?? 0}</span></div>
            <div><b>Last Scan</b><span>${scannerDom.lastScanLabel?.textContent || "-"}</span></div>
            <div><b>Live Mode</b><span>${scannerState.liveMode ? "Running" : "Paused"}</span></div>
        </div>

        <h3>Scan History</h3>
        <div class="scan-history">
            ${
                scannerState.scanHistory.slice(-5).reverse().map(item => `
                    <div class="scan-history-row">
                        <span>${item.time}</span>
                        <span>${item.count} results</span>
                        <span>${item.ms} ms</span>
                    </div>
                `).join("") || "<p>No scan history yet.</p>"
            }
        </div>
    `;
}

window.scannerDiagnostics = {
    renderDiagnostics,
};
