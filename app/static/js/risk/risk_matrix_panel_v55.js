/*
Version 55.0 — Risk Matrix Panel
Production risk overview for native workstation center workspace.
*/
(function () {
    const VERSION = "55.0";

    function current() {
        return window.DecisionEngine?.current?.()
            || window.UnifiedOpportunityStore?.current?.()
            || window.ScannerSelectionUnifier?.current?.()
            || {};
    }

    function num(v, fallback) {
        const n = Number(v);
        return Number.isFinite(n) ? n : fallback;
    }

    function renderCell(label, value, state) {
        return `
            <div class="risk-cell ${state}">
                <span>${label}</span>
                <b>${value}</b>
            </div>
        `;
    }

    function render() {
        const panel = document.getElementById("riskMatrixPanel");
        if (!panel) return;

        const d = current();
        const score = num(d.score ?? d.opportunityScore, 73.3);
        const risk = num(d.riskScore ?? d.risk ?? d.riskQuality, 42);
        const liquidity = num(d.liquidity ?? d.liquidityScore, 72);
        const volatility = num(d.volatility ?? d.volatilityScore, 70);
        const portfolio = num(d.portfolioFit ?? d.portfolioFitScore, 82);
        const exposure = score >= 85 ? "Normal" : score >= 72 ? "Reduced" : "None";

        panel.innerHTML = `
            <section class="risk-matrix-card">
                <div class="risk-header">
                    <h2>Risk Matrix</h2>
                    <span>${risk <= 55 ? "Controlled" : "Review"}</span>
                </div>

                <div class="risk-grid">
                    ${renderCell("Risk", Math.round(risk), risk <= 55 ? "good" : "warn")}
                    ${renderCell("Liquidity", Math.round(liquidity), liquidity >= 65 ? "good" : "warn")}
                    ${renderCell("Volatility", Math.round(volatility), volatility <= 80 ? "good" : "warn")}
                    ${renderCell("Portfolio Fit", Math.round(portfolio), portfolio >= 70 ? "good" : "warn")}
                    ${renderCell("Exposure", exposure, exposure === "None" ? "bad" : "good")}
                    ${renderCell("Status", score >= 72 ? "Plan Only" : "No Trade", score >= 72 ? "warn" : "bad")}
                </div>
            </section>
        `;
    }

    window.EventBus?.subscribe?.("decision.updated", render);
    window.EventBus?.subscribe?.("unified-opportunity.changed", () => setTimeout(render, 50));
    document.addEventListener("DOMContentLoaded", () => setTimeout(render, 1500));

    window.RiskMatrixPanelV55 = { render, version: VERSION };
})();
