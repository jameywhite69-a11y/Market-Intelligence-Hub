/*
Version 62.0 — Market Context Dashboard
Compact dashboard summary for breadth, regime, and flow.
*/
(function () {
    const VERSION = "62.0";

    function render(payload) {
        const panel = document.getElementById("marketContextDashboardV62Panel");
        if (!panel) return;

        const c = payload?.context || payload || window.InstitutionalMarketContextEngineV62?.get?.();
        if (!c) return;

        panel.innerHTML = `
            <section class="v62-dashboard-card">
                <div class="v62-header">
                    <div>
                        <h2>Market Context Dashboard</h2>
                        <span>breadth · flow · regime</span>
                    </div>
                    <strong>${c.regime}</strong>
                </div>

                <div class="v62-bar-list">
                    ${bar("Context", c.contextScore)}
                    ${bar("Breadth", c.breadth)}
                    ${bar("Leadership", c.leadership)}
                    ${bar("Liquidity", c.marketLiquidity)}
                    ${bar("Momentum", c.marketMomentum)}
                    ${bar("Risk Control", 100 - c.marketRisk)}
                </div>
            </section>
        `;
    }

    function bar(label, value) {
        const v = Math.max(0, Math.min(100, Number(value || 0)));
        return `
            <div class="v62-bar-row">
                <b>${label}</b>
                <i><em style="width:${v}%"></em></i>
                <span>${v.toFixed(1)}</span>
            </div>
        `;
    }

    function wire() {
        window.EventBus?.subscribe?.("market-context.updated", render);
        window.EventBus?.subscribe?.("institutional-market-context.updated", render);
        setTimeout(() => render(), 2000);
    }

    window.MarketContextDashboardV62 = { render, version: VERSION };
    document.addEventListener("DOMContentLoaded", () => setTimeout(wire, 1300));
})();
