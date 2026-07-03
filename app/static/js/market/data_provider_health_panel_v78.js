/*
Version 78.0 — Data Provider Health Panel
*/
(function () {
    const VERSION = "78.0";

    function check() {
        const reg = window.MarketDataAdapterRegistryV78?.snapshot?.() || { adapters: [] };
        const active = reg.adapters.find(a => a.id === reg.activeAdapter);
        return [
            ["Registry Loaded", !!window.MarketDataAdapterRegistryV78],
            ["Active Adapter", !!active],
            ["Demo Fallback", reg.adapters.some(a => a.id === "demo")],
            ["Realtime Bridge", !!window.RealtimeDataBusAdapterBridgeV78],
            ["Live Providers Registered", reg.adapters.filter(a => a.live).length > 0],
            ["Safe Default", reg.activeAdapter === "demo" || active?.live === true]
        ];
    }

    function render() {
        const panel = document.getElementById("dataProviderHealthPanelV78");
        if (!panel) return;

        const checks = check();

        panel.innerHTML = `
            <section class="v78-card">
                <div class="v78-header">
                    <div>
                        <h2>Data Provider Health</h2>
                        <span>${checks.filter(x => x[1]).length}/${checks.length} checks passing</span>
                    </div>
                    <strong>${checks.every(x => x[1]) ? "HEALTHY" : "REVIEW"}</strong>
                </div>

                <div class="v78-check-list">
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
        window.EventBus?.subscribe?.("market-data-adapter-registry.updated", render);
        window.EventBus?.subscribe?.("realtime-data.updated", render);
        setTimeout(render, 2000);
    }

    window.DataProviderHealthPanelV78 = { check, render, version: VERSION };
    document.addEventListener("DOMContentLoaded", () => setTimeout(wire, 1400));
})();
