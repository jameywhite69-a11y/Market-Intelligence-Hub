function renderDiagnostics(diagnostics) {
    const monitor = scannerDom.diagnosticsPanel;
    if (!monitor) return;

    if (!diagnostics) {
        monitor.innerHTML = `
            <div class="terminal-dock-empty">
                <b>Scan Monitor</b>
                <span>Standing by</span>
            </div>
        `;
        return;
    }

    monitor.innerHTML = `
        <div class="terminal-scan-strip">
            <div><b>Execution</b><span>${diagnostics.execution_ms ?? "-"} ms</span></div>
            <div><b>Provider</b><span>${diagnostics.provider ?? "demo"}</span></div>
            <div><b>Symbols</b><span>${diagnostics.symbols?.length ?? 0}</span></div>
            <div><b>Timeframes</b><span>${diagnostics.timeframes?.join(", ") ?? "-"}</span></div>
            <div><b>Indicators</b><span>${diagnostics.indicators?.join(", ") ?? "-"}</span></div>
            <div><b>Results</b><span>${diagnostics.result_count ?? 0}</span></div>
            <div><b>Last Scan</b><span>${scannerDom.lastScanLabel?.textContent || "-"}</span></div>
            <div><b>Live</b><span>${scannerState.liveMode ? "Running" : "Paused"}</span></div>
        </div>

        <div class="terminal-scan-history">
            ${scannerState.scanHistory.slice(-3).reverse().map(item => `
                <span>${item.time} · ${item.count} results · ${item.ms} ms</span>
            `).join("")}
        </div>
    `;
}

window.scannerDiagnostics = {
    renderDiagnostics,
};
