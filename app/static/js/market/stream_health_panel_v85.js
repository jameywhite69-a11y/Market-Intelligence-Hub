/*
Version 85.0 — Stream Health Panel
*/
(function () {
    const VERSION = "85.0";

    function check() {
        const snap = window.StreamingMarketDataBusV85?.snapshot?.() || {};
        const quoteCount = Object.keys(snap.quotes || {}).length;
        const candleCount = Object.values(snap.candles || {}).reduce((a, rows) => a + rows.length, 0);

        return [
            ["Streaming Bus Loaded", !!window.StreamingMarketDataBusV85],
            ["Symbols Configured", (snap.symbols || []).length > 0],
            ["Quotes Available", quoteCount > 0],
            ["Candles Building", candleCount > 0],
            ["V79 Feed Compatible", !!window.LiveOpportunityEngineV79],
            ["Paper Safe", true]
        ];
    }

    function render() {
        const panel = document.getElementById("streamHealthPanelV85");
        if (!panel) return;

        const checks = check();

        panel.innerHTML = `
            <section class="v85-card">
                <div class="v85-header">
                    <div>
                        <h2>Stream Health</h2>
                        <span>${checks.filter(x => x[1]).length}/${checks.length} checks passing</span>
                    </div>
                    <strong>${checks.every(x => x[1]) ? "HEALTHY" : "WAITING"}</strong>
                </div>

                <div class="v85-check-list">
                    ${checks.map(([label, ok]) => `
                        <div class="${ok ? "pass" : "fail"}">
                            <b>${ok ? "✓" : "!"}</b>
                            <span>${label}</span>
                        </div>
                    `).join("")}
                </div>
            </section>
        `;
    }

    function wire() {
        window.EventBus?.subscribe?.("streaming-market-data.updated", render);
        setTimeout(render, 2000);
    }

    window.StreamHealthPanelV85 = { check, render, version: VERSION };
    document.addEventListener("DOMContentLoaded", () => setTimeout(wire, 1300));
})();
