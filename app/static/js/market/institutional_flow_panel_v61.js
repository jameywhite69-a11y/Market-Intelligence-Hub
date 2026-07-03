/*
Version 61.0 — Institutional Flow Panel
Infers flow quality from scanner leadership, volume, liquidity, and momentum.
*/
(function () {
    const VERSION = "61.0";

    function infer(list) {
        list = list || window.TIOSInstitutionalScannerV56?.latest || [];
        const top = list.slice(0, 5);
        const avgVolume = top.reduce((a, x) => a + Number(x.volume || 0), 0) / (top.length || 1);
        const avgLiquidity = top.reduce((a, x) => a + Number(x.liquidity || 0), 0) / (top.length || 1);
        const avgMomentum = top.reduce((a, x) => a + Number(x.momentum || 0), 0) / (top.length || 1);
        const flowScore = (avgVolume * 0.35) + (avgLiquidity * 0.35) + (avgMomentum * 0.30);

        return {
            flowScore,
            label: flowScore >= 80 ? "Strong Accumulation" : flowScore >= 68 ? "Constructive" : flowScore >= 55 ? "Mixed" : "Weak",
            avgVolume,
            avgLiquidity,
            avgMomentum,
            leaders: top
        };
    }

    function render(model = infer()) {
        const panel = document.getElementById("institutionalFlowPanelV61");
        if (!panel) return;

        panel.innerHTML = `
            <section class="v61-flow-card">
                <div class="v61-header">
                    <div>
                        <h2>Institutional Flow</h2>
                        <span>volume · liquidity · momentum</span>
                    </div>
                    <strong>${model.label}</strong>
                </div>

                <div class="v61-flow-score">
                    <b>${model.flowScore.toFixed(1)}</b>
                    <i><em style="width:${Math.max(0, Math.min(100, model.flowScore))}%"></em></i>
                </div>

                <div class="v61-regime-grid">
                    <div><small>Volume</small><b>${model.avgVolume.toFixed(1)}</b></div>
                    <div><small>Liquidity</small><b>${model.avgLiquidity.toFixed(1)}</b></div>
                    <div><small>Momentum</small><b>${model.avgMomentum.toFixed(1)}</b></div>
                    <div><small>Leaders</small><b>${model.leaders.length}</b></div>
                </div>
            </section>
        `;
    }

    function wire() {
        window.EventBus?.subscribe?.("scanner.results.updated", payload => render(infer(payload?.results || [])));
        setTimeout(() => render(), 1800);
    }

    window.InstitutionalFlowPanelV61 = { infer, render, version: VERSION };
    document.addEventListener("DOMContentLoaded", () => setTimeout(wire, 1300));
})();
