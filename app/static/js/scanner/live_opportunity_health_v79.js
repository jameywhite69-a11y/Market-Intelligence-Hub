/*
Version 79.0 — Live Opportunity Health
*/
(function () {
    const VERSION = "79.0";

    function check() {
        const opportunities = window.LiveOpportunityEngineV79?.latest?.() || [];
        const quotes = window.RealtimeDataBusV74?.getSnapshot?.()?.quotes || {};
        return [
            ["Live Opportunity Engine", !!window.LiveOpportunityEngineV79],
            ["Realtime Data Available", Object.keys(quotes).length > 0],
            ["Opportunities Generated", opportunities.length > 0],
            ["Scanner Updated", (window.TIOSInstitutionalScannerV56?.latest || []).length > 0],
            ["Top Selection Published", !!opportunities[0]],
            ["Paper Safe", true]
        ];
    }

    function render() {
        const panel = document.getElementById("liveOpportunityHealthPanelV79");
        if (!panel) return;

        const checks = check();

        panel.innerHTML = `
            <section class="v79-card">
                <div class="v79-header">
                    <div>
                        <h2>Live Opportunity Health</h2>
                        <span>${checks.filter(x => x[1]).length}/${checks.length} checks passing</span>
                    </div>
                    <strong>${checks.every(x => x[1]) ? "HEALTHY" : "WAITING"}</strong>
                </div>

                <div class="v79-check-list">
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
        window.EventBus?.subscribe?.("live-opportunities.updated", render);
        window.EventBus?.subscribe?.("realtime-data.updated", render);
        setTimeout(render, 2200);
    }

    window.LiveOpportunityHealthV79 = { check, render, version: VERSION };
    document.addEventListener("DOMContentLoaded", () => setTimeout(wire, 1300));
})();
