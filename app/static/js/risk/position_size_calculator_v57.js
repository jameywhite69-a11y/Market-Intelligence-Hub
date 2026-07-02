/*
Version 57.0 — Position Size Calculator
Paper-only position sizing from unified institutional decision.
*/
(function () {
    const VERSION = "57.0";

    function calc(model) {
        if (!model) return null;
        const account = 100000;
        const riskPct = model.decision === "READY" ? 0.0075 : model.decision === "WATCH" ? 0.005 : 0.0025;
        const riskDollars = account * riskPct;
        const stopDistance = Math.max(0.01, Math.abs(Number(model.entry) - Number(model.stop)));
        const shares = Math.floor(riskDollars / stopDistance);
        const notional = shares * Number(model.entry);

        return {
            account,
            riskPct,
            riskDollars,
            stopDistance,
            shares,
            notional
        };
    }

    function render(model = window.UnifiedDecisionEngineV57?.get?.()) {
        const panel = document.getElementById("positionSizeCalculatorPanel");
        if (!panel || !model) return;

        const c = calc(model);
        panel.innerHTML = `
            <section class="v57-position-card">
                <div class="v57-header">
                    <div>
                        <h2>Position Size Calculator</h2>
                        <span>${model.symbol} · paper sizing</span>
                    </div>
                    <strong>${model.decision}</strong>
                </div>
                <div class="v57-decision-grid">
                    <div><small>Account</small><b>$${c.account.toLocaleString()}</b></div>
                    <div><small>Risk %</small><b>${(c.riskPct * 100).toFixed(2)}%</b></div>
                    <div><small>Risk $</small><b>$${c.riskDollars.toFixed(2)}</b></div>
                    <div><small>Stop Dist.</small><b>${c.stopDistance.toFixed(2)}</b></div>
                    <div><small>Units</small><b>${c.shares}</b></div>
                    <div><small>Notional</small><b>$${c.notional.toFixed(2)}</b></div>
                </div>
            </section>
        `;
    }

    window.EventBus?.subscribe?.("institutional-decision.updated", render);
    document.addEventListener("DOMContentLoaded", () => setTimeout(render, 1800));

    window.PositionSizeCalculatorV57 = { calc, render, version: VERSION };
})();
