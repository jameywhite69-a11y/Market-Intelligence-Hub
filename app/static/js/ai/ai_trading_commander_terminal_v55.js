/*
Version 55.0 — Institutional Trading Terminal
Rich AI Trading Commander terminal panel.
*/
(function () {
    const VERSION = "55.0";

    function current() {
        return window.DecisionEngine?.current?.()
            || window.UnifiedOpportunityStore?.current?.()
            || window.ScannerSelectionUnifier?.current?.()
            || {};
    }

    function n(value, fallback) {
        const x = Number(value);
        return Number.isFinite(x) ? x : fallback;
    }

    function clamp(v) {
        return Math.max(0, Math.min(100, Math.round(v)));
    }

    function model() {
        const d = current();
        const symbol = d.symbol || window.ScannerSelectionUnifier?.current?.()?.symbol || "ETH";
        const timeframe = d.timeframe || window.ScannerSelectionUnifier?.current?.()?.timeframe || "1h";

        const confidence = n(d.confidence ?? d.confidenceScore, 73.3);
        const opportunity = n(d.score ?? d.opportunityScore ?? d.validationScore, 73.3);
        const risk = n(d.riskScore ?? d.risk ?? d.riskQuality, 42);
        const expectedR = n(d.expectedR ?? d.expectedReward, 2.4);

        const action =
            opportunity >= 85 && confidence >= 80 && risk <= 55 ? "READY" :
            opportunity >= 72 ? "WAIT" :
            opportunity >= 60 ? "WATCH" :
            "AVOID";

        return {
            symbol,
            timeframe,
            action,
            confidence,
            opportunity,
            risk,
            expectedR,
            trend: n(d.trend ?? d.trendScore, 68),
            momentum: n(d.momentum ?? d.momentumScore, 64),
            structure: n(d.structure ?? d.structureScore, 58),
            liquidity: n(d.liquidity ?? d.liquidityScore, 72),
            portfolio: n(d.portfolioFit ?? d.portfolioFitScore, 82),
            entry: n(d.entry ?? d.idealEntry, 199.40),
            stop: n(d.stop ?? d.stopLoss, 193.10),
            tp1: n(d.tp1 ?? d.takeProfit1, 203.60),
            tp2: n(d.tp2 ?? d.takeProfit2, 206.80)
        };
    }

    function gauge(label, value) {
        const v = clamp(value);
        return `
            <div class="terminal-gauge">
                <div class="terminal-gauge-head"><span>${label}</span><b>${v}</b></div>
                <div class="terminal-gauge-track"><i style="width:${v}%"></i></div>
            </div>
        `;
    }

    function render() {
        const panel = document.getElementById("aiTradingCommanderPanel");
        if (!panel) return;

        const m = model();
        const stateClass = m.action.toLowerCase();

        panel.innerHTML = `
            <section class="terminal-commander ${stateClass}">
                <div class="terminal-commander-header">
                    <div>
                        <h2>AI Trading Commander</h2>
                        <span>${m.symbol} · ${m.timeframe} · Institutional Decision Synthesis</span>
                    </div>
                    <div class="terminal-verdict">
                        <b>${m.action}</b>
                        <span>${m.confidence.toFixed(1)}%</span>
                    </div>
                </div>

                <div class="terminal-commander-body">
                    <div class="terminal-action-block">
                        <div class="terminal-action-badge">${m.action}</div>
                        <p>${m.symbol} is currently classified as <b>${m.action}</b>. Execution should remain conditional on confirmation, risk limits, and broker readiness.</p>
                    </div>

                    <div class="terminal-level-grid">
                        <div><small>Ideal Entry</small><b>${m.entry.toFixed(2)}</b></div>
                        <div><small>Stop</small><b>${m.stop.toFixed(2)}</b></div>
                        <div><small>Target 1</small><b>${m.tp1.toFixed(2)}</b></div>
                        <div><small>Target 2</small><b>${m.tp2.toFixed(2)}</b></div>
                        <div><small>Expected R</small><b>${m.expectedR.toFixed(2)}R</b></div>
                        <div><small>Risk</small><b>${clamp(m.risk)}</b></div>
                    </div>

                    <div class="terminal-gauge-grid">
                        ${gauge("Opportunity", m.opportunity)}
                        ${gauge("Trend", m.trend)}
                        ${gauge("Momentum", m.momentum)}
                        ${gauge("Structure", m.structure)}
                        ${gauge("Liquidity", m.liquidity)}
                        ${gauge("Portfolio Fit", m.portfolio)}
                    </div>
                </div>
            </section>
        `;
    }

    window.EventBus?.subscribe?.("decision.updated", render);
    window.EventBus?.subscribe?.("unified-opportunity.changed", () => setTimeout(render, 50));
    window.EventBus?.subscribe?.("scanner.selection.changed", render);
    document.addEventListener("DOMContentLoaded", () => setTimeout(render, 1000));

    window.AITradingCommanderTerminalV55 = { render, version: VERSION };
})();
