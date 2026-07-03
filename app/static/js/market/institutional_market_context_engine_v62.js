/*
Version 62.0 — Institutional Market Context Engine
Purpose:
- Combine market regime, breadth, relative strength, and flow into one market context object.
- Feed context into AI Commander / execution readiness without placing orders.
*/
(function () {
    const VERSION = "62.0";
    const STATE = { current: null };

    function candidates() {
        return window.TIOSInstitutionalScannerV56?.latest || [];
    }

    function avg(values, fallback = 0) {
        const nums = values.map(Number).filter(Number.isFinite);
        if (!nums.length) return fallback;
        return nums.reduce((a, b) => a + b, 0) / nums.length;
    }

    function classifyContext(list) {
        list = list || candidates();

        const scores = list.map(x => Number(x.score || 0));
        const momentum = list.map(x => Number(x.momentum || x.metrics?.momentum || 0));
        const liquidity = list.map(x => Number(x.liquidity || x.metrics?.liquidity || 0));
        const risk = list.map(x => Number(x.risk || x.metrics?.risk || 50));
        const volume = list.map(x => Number(x.volume || x.volumeScore || 0));
        const strong = list.filter(x => Number(x.score || 0) >= 84).length;
        const tradable = list.filter(x => Number(x.score || 0) >= 72).length;
        const weak = list.filter(x => Number(x.score || 0) < 64).length;
        const total = Math.max(1, list.length);

        const marketScore = avg(scores, 60);
        const marketMomentum = avg(momentum, 60);
        const marketLiquidity = avg(liquidity, 60);
        const marketRisk = avg(risk, 50);
        const volumeRegime = avg(volume, 60);
        const breadth = (tradable / total) * 100;
        const leadership = (strong / total) * 100;
        const weakness = (weak / total) * 100;

        let regime = "Neutral";
        if (marketScore >= 84 && marketMomentum >= 68 && marketRisk <= 55 && breadth >= 55) {
            regime = "Risk-On Trend";
        } else if (marketRisk >= 62 || weakness >= 45) {
            regime = "Risk-Off";
        } else if (breadth < 35 && leadership < 20) {
            regime = "Narrow / Fragile";
        } else if (marketMomentum < 55 && marketScore >= 65) {
            regime = "Range / Rotation";
        } else if (marketLiquidity < 58) {
            regime = "Low Liquidity";
        }

        const tradePermission =
            regime === "Risk-On Trend" ? "Aggressive Selective" :
            regime === "Range / Rotation" ? "Selective Only" :
            regime === "Narrow / Fragile" ? "Reduced Size" :
            regime === "Low Liquidity" ? "Reduce / Avoid" :
            regime === "Risk-Off" ? "Defense Only" :
            "Normal Watch";

        const contextScore =
            marketScore * 0.25 +
            marketMomentum * 0.20 +
            marketLiquidity * 0.15 +
            breadth * 0.20 +
            leadership * 0.10 +
            (100 - marketRisk) * 0.10;

        return {
            version: VERSION,
            timestamp: new Date().toISOString(),
            candidateCount: list.length,
            regime,
            tradePermission,
            contextScore: Number(contextScore.toFixed(1)),
            marketScore: Number(marketScore.toFixed(1)),
            marketMomentum: Number(marketMomentum.toFixed(1)),
            marketLiquidity: Number(marketLiquidity.toFixed(1)),
            marketRisk: Number(marketRisk.toFixed(1)),
            volumeRegime: Number(volumeRegime.toFixed(1)),
            breadth: Number(breadth.toFixed(1)),
            leadership: Number(leadership.toFixed(1)),
            weakness: Number(weakness.toFixed(1)),
            leaders: list.slice(0, 5)
        };
    }

    function publish(context, source = "market-context") {
        STATE.current = context;
        window.EventBus?.publish?.("market-context.updated", { source, context });
        window.EventBus?.publish?.("institutional-market-context.updated", context);
        render(context);
        return context;
    }

    function render(context = STATE.current || classifyContext()) {
        const panel = document.getElementById("institutionalMarketContextPanel");
        if (!panel) return;

        panel.innerHTML = `
            <section class="v62-context-card ${context.regime.toLowerCase().replaceAll(" ", "-").replaceAll("/", "")}">
                <div class="v62-header">
                    <div>
                        <h2>Institutional Market Context</h2>
                        <span>${context.candidateCount} candidates · ${context.timestamp.split("T")[1].slice(0, 8)}</span>
                    </div>
                    <strong>${context.tradePermission}</strong>
                </div>

                <div class="v62-regime-banner">
                    <b>${context.regime}</b>
                    <span>Context Score ${context.contextScore}</span>
                </div>

                <div class="v62-context-grid">
                    <div><small>Market</small><b>${context.marketScore}</b></div>
                    <div><small>Momentum</small><b>${context.marketMomentum}</b></div>
                    <div><small>Liquidity</small><b>${context.marketLiquidity}</b></div>
                    <div><small>Risk</small><b>${context.marketRisk}</b></div>
                    <div><small>Breadth</small><b>${context.breadth}%</b></div>
                    <div><small>Leadership</small><b>${context.leadership}%</b></div>
                </div>

                <div class="v62-leader-strip">
                    ${context.leaders.map((x, i) => `
                        <span><b>#${i + 1} ${x.symbol}</b><em>${Number(x.score || 0).toFixed(1)}</em></span>
                    `).join("") || "<span>Run scan to build market context</span>"}
                </div>
            </section>
        `;
    }

    function refresh(source = "refresh") {
        return publish(classifyContext(candidates()), source);
    }

    function wire() {
        window.EventBus?.subscribe?.("scanner.results.updated", payload => {
            publish(classifyContext(payload?.results || candidates()), "scanner.results");
        });
        setTimeout(() => refresh("bootstrap"), 1600);
    }

    window.InstitutionalMarketContextEngineV62 = {
        classifyContext,
        refresh,
        render,
        get: () => STATE.current,
        version: VERSION
    };

    document.addEventListener("DOMContentLoaded", () => setTimeout(wire, 1000));
})();
