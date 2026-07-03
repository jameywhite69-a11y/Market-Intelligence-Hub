/*
Version 64.0 — Exposure Engine
Calculates simulated portfolio exposure by asset class and concentration.
*/
(function () {
    const VERSION = "64.0";

    function calculate(snapshot) {
        snapshot = snapshot || window.PortfolioIntelligenceStoreV64?.get?.() || {};
        const positions = snapshot.positions || [];
        const equity = Number(snapshot.account?.equity || 100000);

        const byClass = {};
        let gross = 0;
        let largest = { symbol: "—", notional: 0 };

        positions.forEach(p => {
            const n = Number(p.notional || 0);
            gross += p.assetClass !== "Cash" ? n : 0;
            byClass[p.assetClass] = (byClass[p.assetClass] || 0) + n;
            if (p.assetClass !== "Cash" && n > largest.notional) largest = { symbol: p.symbol, notional: n };
        });

        const rows = Object.entries(byClass).map(([name, value]) => ({
            name,
            value,
            pct: equity ? (value / equity) * 100 : 0
        })).sort((a, b) => b.value - a.value);

        return {
            equity,
            gross,
            grossPct: equity ? (gross / equity) * 100 : 0,
            largest,
            largestPct: equity ? (largest.notional / equity) * 100 : 0,
            rows
        };
    }

    function render(snapshot) {
        const panel = document.getElementById("portfolioExposureEngineV64Panel");
        if (!panel) return;

        const model = calculate(snapshot);

        panel.innerHTML = `
            <section class="v64-card">
                <div class="v64-header">
                    <div>
                        <h2>Portfolio Exposure Engine</h2>
                        <span>asset allocation and concentration</span>
                    </div>
                    <strong>${model.grossPct.toFixed(1)}%</strong>
                </div>

                <div class="v64-bar-list">
                    ${model.rows.map(row => `
                        <div class="v64-bar-row">
                            <b>${row.name}</b>
                            <i><em style="width:${Math.max(0, Math.min(100, row.pct))}%"></em></i>
                            <span>${row.pct.toFixed(1)}%</span>
                        </div>
                    `).join("")}
                </div>

                <div class="v64-note">
                    <b>Largest Exposure</b>
                    <span>${model.largest.symbol}: ${model.largestPct.toFixed(1)}% of equity</span>
                </div>
            </section>
        `;
    }

    function wire() {
        window.PortfolioIntelligenceStoreV64?.subscribe?.(render);
    }

    window.ExposureEngineV64 = { calculate, render, version: VERSION };
    document.addEventListener("DOMContentLoaded", () => setTimeout(wire, 1700));
})();
