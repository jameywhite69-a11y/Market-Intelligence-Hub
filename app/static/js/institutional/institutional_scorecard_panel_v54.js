/*
Version 54.0 — Institutional Scorecard Panel
Turns institutional intelligence into a readable professional scorecard.
*/
(function () {
    function current() {
        return window.DecisionEngine?.current?.()
            || window.UnifiedOpportunityStore?.current?.()
            || window.ScannerSelectionUnifier?.current?.()
            || {};
    }

    function val(obj, keys, fallback) {
        for (const key of keys) {
            if (obj[key] !== undefined && obj[key] !== null) {
                const n = Number(obj[key]);
                if (Number.isFinite(n)) return n;
            }
        }
        return fallback;
    }

    function renderScore(label, value) {
        const v = Math.max(0, Math.min(100, Math.round(value)));
        return `
            <div class="institutional-score-row">
                <span>${label}</span>
                <b>${v}</b>
                <i><em style="width:${v}%"></em></i>
            </div>
        `;
    }

    function renderInstitutionalScorecard() {
        const panel = document.getElementById("institutionalScorecardPanel");
        if (!panel) return;

        const d = current();
        const symbol = d.symbol || window.ScannerSelectionUnifier?.current?.()?.symbol || "ETH";
        const trend = val(d, ["trend", "trendScore"], 68);
        const momentum = val(d, ["momentum", "momentumScore"], 64);
        const structure = val(d, ["structure", "structureScore"], 58);
        const liquidity = val(d, ["liquidity", "liquidityScore"], 72);
        const volatility = val(d, ["volatility", "volatilityScore"], 70);
        const portfolio = val(d, ["portfolioFit", "portfolioFitScore"], 82);
        const risk = val(d, ["risk", "riskScore", "riskQuality"], 90);
        const overall = Math.round((trend + momentum + structure + liquidity + volatility + portfolio + risk) / 7);
        const grade = overall >= 85 ? "A" : overall >= 72 ? "B" : overall >= 60 ? "C" : "D";
        const recommendation = overall >= 85 ? "EXECUTION READY" : overall >= 72 ? "WAIT" : "STAND DOWN";

        panel.innerHTML = `
            <section class="institutional-scorecard">
                <div class="scorecard-header">
                    <div>
                        <h2>Institutional Scorecard</h2>
                        <span>${symbol}</span>
                    </div>
                    <strong>${overall} · ${grade}</strong>
                </div>

                <div class="institutional-score-list">
                    ${renderScore("Trend", trend)}
                    ${renderScore("Momentum", momentum)}
                    ${renderScore("Structure", structure)}
                    ${renderScore("Liquidity", liquidity)}
                    ${renderScore("Volatility", volatility)}
                    ${renderScore("Portfolio Fit", portfolio)}
                    ${renderScore("Risk Control", risk)}
                </div>

                <div class="scorecard-footer">
                    <b>${recommendation}</b>
                    <span>Institutional quality must remain aligned before execution.</span>
                </div>
            </section>
        `;
    }

    window.EventBus?.subscribe?.("decision.updated", renderInstitutionalScorecard);
    window.EventBus?.subscribe?.("unified-opportunity.changed", () => setTimeout(renderInstitutionalScorecard, 50));
    document.addEventListener("DOMContentLoaded", () => setTimeout(renderInstitutionalScorecard, 1300));

    window.InstitutionalScorecardPanelV54 = { renderInstitutionalScorecard };
})();
