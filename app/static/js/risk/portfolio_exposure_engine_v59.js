/*
Version 59.0 — Portfolio Exposure Engine
Paper-only portfolio exposure summary.
*/
(function () {
    const VERSION = "59.0";

    function model(plan) {
        plan = plan || window.InstitutionalTradeEngineV59?.current || {};
        const cash = 75000.01;
        const equity = 100000.00;
        const proposed = Number(plan.notional || 0);
        const cryptoExposure = Math.min(100, proposed / equity * 100);
        const cashAfter = Math.max(0, cash - proposed);
        const remainingRisk = Math.max(0, 1500 - Number(plan.riskDollars || 0));

        return {
            equity,
            cash,
            proposed,
            cryptoExposure,
            cashAfter,
            remainingRisk,
            correlationNote: cryptoExposure > 30 ? "Correlation review required" : "Exposure controlled"
        };
    }

    function render(payload) {
        const panel = document.getElementById("portfolioExposureEnginePanel");
        if (!panel) return;

        const m = model(payload?.plan || payload);

        panel.innerHTML = `
            <section class="v59-exposure-card">
                <div class="v59-header">
                    <div>
                        <h2>Portfolio Exposure Engine</h2>
                        <span>paper portfolio risk</span>
                    </div>
                    <strong>${m.cryptoExposure.toFixed(1)}%</strong>
                </div>

                <div class="v59-trade-grid">
                    <div><small>Equity</small><b>$${m.equity.toFixed(2)}</b></div>
                    <div><small>Cash</small><b>$${m.cash.toFixed(2)}</b></div>
                    <div><small>Proposed</small><b>$${m.proposed.toFixed(2)}</b></div>
                    <div><small>Cash After</small><b>$${m.cashAfter.toFixed(2)}</b></div>
                    <div><small>Crypto Exposure</small><b>${m.cryptoExposure.toFixed(1)}%</b></div>
                    <div><small>Risk Remaining</small><b>$${m.remainingRisk.toFixed(2)}</b></div>
                </div>

                <div class="v59-note">${m.correlationNote}</div>
            </section>
        `;
    }

    function wire() {
        window.EventBus?.subscribe?.("institutional-trade-plan.updated", render);
        setTimeout(() => render(), 1600);
    }

    window.PortfolioExposureEngineV59 = { render, model, version: VERSION };
    document.addEventListener("DOMContentLoaded", () => setTimeout(wire, 1000));
})();
