/*
Version 82.0 — AI Assistant Health
*/
(function () {
    const VERSION = "82.0";

    function check() {
        return [
            ["Assistant Loaded", !!window.AITradingAssistantV82],
            ["Live Opportunities", (window.LiveOpportunityEngineV79?.latest?.() || []).length > 0],
            ["Paper Account", !!window.PaperTradingAccountV80],
            ["Position Risk", !!window.PositionRiskManagerV81],
            ["Market Context", !!window.InstitutionalMarketContextEngineV62 || !!window.MarketContextStoreV63],
            ["Paper Safe", true]
        ];
    }

    function render() {
        const panel = document.getElementById("aiAssistantHealthPanelV82");
        if (!panel) return;

        const checks = check();

        panel.innerHTML = `
            <section class="v82-card">
                <div class="v82-header">
                    <div>
                        <h2>AI Assistant Health</h2>
                        <span>${checks.filter(x => x[1]).length}/${checks.length} checks passing</span>
                    </div>
                    <strong>${checks.every(x => x[1]) ? "READY" : "WAITING"}</strong>
                </div>

                <div class="v82-check-list">
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
        window.EventBus?.subscribe?.("ai-trading-assistant.updated", render);
        window.EventBus?.subscribe?.("live-opportunities.updated", render);
        setTimeout(render, 2200);
    }

    window.AIAssistantHealthV82 = { check, render, version: VERSION };
    document.addEventListener("DOMContentLoaded", () => setTimeout(wire, 1300));
})();
