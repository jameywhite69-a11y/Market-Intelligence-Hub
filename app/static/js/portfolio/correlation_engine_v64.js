/*
Version 64.0 — Correlation Engine
Detects simulated concentration in correlated portfolio groups.
*/
(function () {
    const VERSION = "64.0";

    function calculate(snapshot) {
        snapshot = snapshot || window.PortfolioIntelligenceStoreV64?.get?.() || {};
        const positions = (snapshot.positions || []).filter(p => p.assetClass !== "Cash");
        const groups = {};

        positions.forEach(p => {
            const group = p.correlationGroup || p.assetClass || "Other";
            groups[group] = groups[group] || [];
            groups[group].push(p);
        });

        const rows = Object.entries(groups).map(([group, items]) => {
            const notional = items.reduce((a, p) => a + Number(p.notional || 0), 0);
            const avgQuality = items.reduce((a, p) => a + Number(p.quality || 0), 0) / (items.length || 1);
            return {
                group,
                count: items.length,
                symbols: items.map(x => x.symbol).join(", "),
                notional,
                avgQuality,
                risk: items.length >= 3 ? "High" : items.length === 2 ? "Moderate" : "Controlled"
            };
        }).sort((a, b) => b.notional - a.notional);

        return rows;
    }

    function render(snapshot) {
        const panel = document.getElementById("portfolioCorrelationEngineV64Panel");
        if (!panel) return;

        const rows = calculate(snapshot);

        panel.innerHTML = `
            <section class="v64-card">
                <div class="v64-header">
                    <div>
                        <h2>Correlation Engine</h2>
                        <span>avoid stacking the same trade</span>
                    </div>
                    <strong>${rows[0]?.risk || "—"}</strong>
                </div>

                <div class="v64-table-list">
                    ${rows.map(row => `
                        <div class="v64-table-row ${row.risk.toLowerCase()}">
                            <b>${row.group}</b>
                            <span>${row.symbols}</span>
                            <em>${row.risk}</em>
                        </div>
                    `).join("") || "<div class='v64-empty'>No active correlation groups.</div>"}
                </div>
            </section>
        `;
    }

    function wire() {
        window.PortfolioIntelligenceStoreV64?.subscribe?.(render);
    }

    window.CorrelationEngineV64 = { calculate, render, version: VERSION };
    document.addEventListener("DOMContentLoaded", () => setTimeout(wire, 1800));
})();
