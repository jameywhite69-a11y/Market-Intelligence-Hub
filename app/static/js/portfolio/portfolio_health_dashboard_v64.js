/*
Version 64.0 — Portfolio Health Dashboard
Combines exposure, correlation, risk budget, and opportunity quality.
*/
(function () {
    const VERSION = "64.0";

    function build(snapshot) {
        const exposure = window.ExposureEngineV64?.calculate?.(snapshot) || {};
        const correlation = window.CorrelationEngineV64?.calculate?.(snapshot) || [];
        const risk = window.RiskBudgetEngineV64?.calculate?.(snapshot) || {};
        const positions = snapshot?.positions || [];
        const qualities = positions.filter(p => p.assetClass !== "Cash").map(p => Number(p.quality || 0));
        const avgQuality = qualities.length ? qualities.reduce((a, b) => a + b, 0) / qualities.length : 0;
        const heat = Math.min(100, Number(exposure.grossPct || 0) + Number(risk.usedPct || 0) * 10);

        return {
            exposure,
            correlation,
            risk,
            avgQuality,
            heat,
            status: heat < 45 && risk.status !== "Constrained" ? "Healthy" : heat < 70 ? "Elevated" : "Hot"
        };
    }

    function render(snapshot) {
        const panel = document.getElementById("portfolioHealthDashboardV64Panel");
        if (!panel) return;

        const m = build(snapshot);

        panel.innerHTML = `
            <section class="v64-card v64-health ${m.status.toLowerCase()}">
                <div class="v64-header">
                    <div>
                        <h2>Portfolio Health Dashboard</h2>
                        <span>exposure · correlation · risk budget</span>
                    </div>
                    <strong>${m.status}</strong>
                </div>

                <div class="v64-grid">
                    <div><small>Gross Exposure</small><b>${Number(m.exposure.grossPct || 0).toFixed(1)}%</b></div>
                    <div><small>Portfolio Heat</small><b>${m.heat.toFixed(1)}</b></div>
                    <div><small>Risk Status</small><b>${m.risk.status || "—"}</b></div>
                    <div><small>Risk Remaining</small><b>$${Number(m.risk.remaining || 0).toFixed(2)}</b></div>
                    <div><small>Avg Quality</small><b>${m.avgQuality.toFixed(1)}</b></div>
                    <div><small>Correlation</small><b>${m.correlation[0]?.risk || "Controlled"}</b></div>
                </div>

                <div class="v64-note">
                    <b>AI Portfolio Rule</b>
                    <span>New trades should be reduced or blocked when portfolio heat, correlation, or risk budget becomes constrained.</span>
                </div>
            </section>
        `;
    }

    function wire() {
        window.PortfolioIntelligenceStoreV64?.subscribe?.(render);
    }

    window.PortfolioHealthDashboardV64 = { build, render, version: VERSION };
    document.addEventListener("DOMContentLoaded", () => setTimeout(wire, 2000));
})();
