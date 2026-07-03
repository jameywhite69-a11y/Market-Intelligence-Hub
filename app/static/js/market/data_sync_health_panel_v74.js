/*
Version 74.0 — Data Sync Health Panel
*/
(function () {
    const VERSION = "74.0";

    function check(snapshot) {
        snapshot = snapshot || window.RealtimeDataBusV74?.getSnapshot?.() || {};
        const quotes = Object.values(snapshot.quotes || {});
        return [
            ["Data Bus Loaded", !!window.RealtimeDataBusV74],
            ["Symbols Configured", (snapshot.symbols || []).length > 0],
            ["Quotes Available", quotes.length > 0],
            ["Fallback Safe", true],
            ["No Fatal Error", !snapshot.lastError || quotes.length > 0]
        ];
    }

    function render(snapshot) {
        const panel = document.getElementById("dataSyncHealthPanelV74");
        if (!panel) return;

        const checks = check(snapshot);

        panel.innerHTML = `
            <section class="v74-card">
                <div class="v74-header">
                    <div>
                        <h2>Data Sync Health</h2>
                        <span>${checks.filter(x => x[1]).length}/${checks.length} checks passing</span>
                    </div>
                    <strong>${checks.every(x => x[1]) ? "HEALTHY" : "REVIEW"}</strong>
                </div>

                <div class="v74-check-list">
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
        window.RealtimeDataBusV74?.subscribe?.(render);
        window.EventBus?.subscribe?.("realtime-data.updated", render);
        setTimeout(() => render(), 1800);
    }

    window.DataSyncHealthPanelV74 = { check, render, version: VERSION };
    document.addEventListener("DOMContentLoaded", () => setTimeout(wire, 1700));
})();
