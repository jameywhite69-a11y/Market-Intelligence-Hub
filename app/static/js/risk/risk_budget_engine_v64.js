/*
Version 64.0 — Risk Budget Engine
Tracks simulated daily risk budget usage.
*/
(function () {
    const VERSION = "64.0";

    function calculate(snapshot) {
        snapshot = snapshot || window.PortfolioIntelligenceStoreV64?.get?.() || {};
        const account = snapshot.account || {};
        const positions = snapshot.positions || [];
        const equity = Number(account.equity || 100000);
        const maxRiskPct = Number(account.dailyRiskLimitPct || 2);
        const usedPositionRisk = positions.reduce((a, p) => a + Number(p.risk || 0), 0);
        const maxRiskDollars = equity * (maxRiskPct / 100);
        const usedPct = (usedPositionRisk / equity) * 100;
        const remaining = Math.max(0, maxRiskDollars - usedPositionRisk);

        return {
            equity,
            maxRiskPct,
            maxRiskDollars,
            usedPositionRisk,
            usedPct,
            remaining,
            status: remaining > maxRiskDollars * 0.5 ? "Healthy" : remaining > maxRiskDollars * 0.2 ? "Limited" : "Constrained"
        };
    }

    function render(snapshot) {
        const panel = document.getElementById("riskBudgetEngineV64Panel");
        if (!panel) return;

        const m = calculate(snapshot);

        panel.innerHTML = `
            <section class="v64-card">
                <div class="v64-header">
                    <div>
                        <h2>Risk Budget Engine</h2>
                        <span>daily risk capacity</span>
                    </div>
                    <strong>${m.status}</strong>
                </div>

                <div class="v64-grid">
                    <div><small>Max Risk</small><b>${m.maxRiskPct.toFixed(2)}%</b></div>
                    <div><small>Max Dollars</small><b>$${m.maxRiskDollars.toFixed(2)}</b></div>
                    <div><small>Used</small><b>$${m.usedPositionRisk.toFixed(2)}</b></div>
                    <div><small>Used %</small><b>${m.usedPct.toFixed(2)}%</b></div>
                    <div><small>Remaining</small><b>$${m.remaining.toFixed(2)}</b></div>
                    <div><small>Status</small><b>${m.status}</b></div>
                </div>
            </section>
        `;
    }

    function wire() {
        window.PortfolioIntelligenceStoreV64?.subscribe?.(render);
    }

    window.RiskBudgetEngineV64 = { calculate, render, version: VERSION };
    document.addEventListener("DOMContentLoaded", () => setTimeout(wire, 1900));
})();
