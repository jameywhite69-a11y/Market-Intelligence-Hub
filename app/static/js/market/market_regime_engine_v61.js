/*
Version 61.0 — Market Regime Engine
Creates a market-wide regime view from scanner candidates.
No live broker orders.
*/
(function () {
    const VERSION = "61.0";

    function candidates() {
        return window.TIOSInstitutionalScannerV56?.latest || [];
    }

    function avg(values) {
        if (!values.length) return 0;
        return values.reduce((a, b) => a + b, 0) / values.length;
    }

    function classify(list) {
        const scores = list.map(x => Number(x.score || 0));
        const momentum = list.map(x => Number(x.momentum || x.metrics?.momentum || 0));
        const liquidity = list.map(x => Number(x.liquidity || x.metrics?.liquidity || 0));
        const risks = list.map(x => Number(x.risk || x.metrics?.risk || 50));

        const marketScore = avg(scores);
        const marketMomentum = avg(momentum);
        const marketLiquidity = avg(liquidity);
        const marketRisk = avg(risks);

        let regime = "Neutral";
        if (marketScore >= 84 && marketMomentum >= 65 && marketRisk <= 55) regime = "Risk-On Trend";
        else if (marketRisk >= 62) regime = "Risk-Off";
        else if (marketMomentum < 55 && marketScore >= 65) regime = "Range / Rotation";
        else if (marketLiquidity < 58) regime = "Low Liquidity";
        else if (marketScore < 62) regime = "Defensive";

        return {
            version: VERSION,
            regime,
            marketScore,
            marketMomentum,
            marketLiquidity,
            marketRisk,
            candidateCount: list.length,
            leadership: list.slice(0, 5),
            timestamp: new Date().toISOString()
        };
    }

    function render(model = classify(candidates())) {
        const panel = document.getElementById("marketRegimeEnginePanel");
        if (!panel) return;

        panel.innerHTML = `
            <section class="v61-regime-card ${model.regime.toLowerCase().replaceAll(" ", "-").replaceAll("/", "")}">
                <div class="v61-header">
                    <div>
                        <h2>Market Regime Engine</h2>
                        <span>${model.candidateCount} candidates analyzed</span>
                    </div>
                    <strong>${model.regime}</strong>
                </div>

                <div class="v61-regime-grid">
                    <div><small>Market Score</small><b>${model.marketScore.toFixed(1)}</b></div>
                    <div><small>Momentum</small><b>${model.marketMomentum.toFixed(1)}</b></div>
                    <div><small>Liquidity</small><b>${model.marketLiquidity.toFixed(1)}</b></div>
                    <div><small>Risk</small><b>${model.marketRisk.toFixed(1)}</b></div>
                </div>

                <div class="v61-leadership-strip">
                    ${model.leadership.map((x, i) => `
                        <span><b>#${i + 1} ${x.symbol}</b><em>${Number(x.score || 0).toFixed(1)}</em></span>
                    `).join("") || "<span>No leadership data yet</span>"}
                </div>
            </section>
        `;

        window.MarketRegimeEngineV61.current = model;
        window.EventBus?.publish?.("market-regime.updated", model);
    }

    function wire() {
        window.EventBus?.subscribe?.("scanner.results.updated", payload => render(classify(payload?.results || candidates())));
        setTimeout(() => render(), 1500);
    }

    window.MarketRegimeEngineV61 = {
        classify,
        render,
        current: null,
        version: VERSION
    };

    document.addEventListener("DOMContentLoaded", () => setTimeout(wire, 1000));
})();
