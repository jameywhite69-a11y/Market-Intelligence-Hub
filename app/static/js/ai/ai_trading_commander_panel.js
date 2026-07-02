/*
Version 54.0 — AI Trading Commander
Creates a professional command panel from current decision / opportunity state.
*/
(function () {
    const VERSION = "54.0";

    function getSymbol() {
        return window.WorkspaceStore?.get?.("selectedSymbol")
            || window.WorkspaceContext?.symbol
            || window.ScannerSelectionUnifier?.current?.()?.symbol
            || "ETH";
    }

    function getTimeframe() {
        return window.WorkspaceStore?.get?.("selectedTimeframe")
            || window.WorkspaceContext?.timeframe
            || window.ScannerSelectionUnifier?.current?.()?.timeframe
            || "1h";
    }

    function getDecision() {
        return window.DecisionEngine?.current?.()
            || window.UnifiedOpportunityStore?.current?.()
            || window.ScannerSelectionUnifier?.current?.()
            || {};
    }

    function num(value, fallback) {
        const n = Number(value);
        return Number.isFinite(n) ? n : fallback;
    }

    function classify(score) {
        if (score >= 85) return "EXECUTION READY";
        if (score >= 72) return "WAIT FOR CONFIRMATION";
        if (score >= 60) return "WATCHLIST";
        return "AVOID";
    }

    function action(score, risk) {
        if (score >= 85 && risk <= 55) return "PREPARE ORDER";
        if (score >= 72) return "WAIT FOR PULLBACK";
        if (score >= 60) return "MONITOR ONLY";
        return "STAND DOWN";
    }

    function buildModel() {
        const d = getDecision();
        const symbol = d.symbol || getSymbol();
        const timeframe = d.timeframe || getTimeframe();

        const opportunity = num(d.opportunityScore ?? d.score ?? d.validationScore, 73.3);
        const confidence = num(d.confidence ?? d.confidenceScore, 73.3);
        const expectedR = num(d.expectedR ?? d.expected_reward ?? d.expectedReward, 2.4);
        const risk = num(d.riskScore ?? d.risk ?? d.riskQuality, 42);

        const trend = num(d.trend ?? d.trendScore, 68);
        const momentum = num(d.momentum ?? d.momentumScore, 64);
        const structure = num(d.structure ?? d.structureScore, 58);
        const liquidity = num(d.liquidity ?? d.liquidityScore, 72);
        const portfolioFit = num(d.portfolioFit ?? d.portfolioFitScore, 82);

        const recommendation = action(opportunity, risk);
        const classification = classify(opportunity);

        return {
            symbol,
            timeframe,
            opportunity,
            confidence,
            expectedR,
            risk,
            trend,
            momentum,
            structure,
            liquidity,
            portfolioFit,
            recommendation,
            classification,
            entry: num(d.entry ?? d.idealEntry, 199.40),
            stop: num(d.stop ?? d.stopLoss, 193.10),
            tp1: num(d.tp1 ?? d.takeProfit1, 203.60),
            tp2: num(d.tp2 ?? d.takeProfit2, 206.80)
        };
    }

    function pct(v) {
        return Math.round(num(v, 0));
    }

    function renderBar(label, value) {
        return `
            <div class="commander-metric">
                <div class="commander-metric-label">
                    <span>${label}</span>
                    <b>${pct(value)}</b>
                </div>
                <div class="commander-bar"><i style="width:${Math.max(0, Math.min(100, pct(value)))}%"></i></div>
            </div>
        `;
    }

    function renderAITradingCommander() {
        const panel = document.getElementById("aiTradingCommanderPanel");
        if (!panel) return;

        const m = buildModel();
        panel.innerHTML = `
            <section class="ai-commander-card">
                <div class="ai-commander-header">
                    <div>
                        <h2>AI Trading Commander</h2>
                        <span>${m.symbol} · ${m.timeframe}</span>
                    </div>
                    <strong>${m.confidence.toFixed(1)}%</strong>
                </div>

                <div class="ai-commander-verdict">
                    <b>${m.recommendation}</b>
                    <span>${m.classification}</span>
                </div>

                <div class="ai-commander-grid">
                    <div>
                        <small>Ideal Entry</small>
                        <b>${m.entry.toFixed(2)}</b>
                    </div>
                    <div>
                        <small>Stop</small>
                        <b>${m.stop.toFixed(2)}</b>
                    </div>
                    <div>
                        <small>TP1</small>
                        <b>${m.tp1.toFixed(2)}</b>
                    </div>
                    <div>
                        <small>TP2</small>
                        <b>${m.tp2.toFixed(2)}</b>
                    </div>
                    <div>
                        <small>Expected R</small>
                        <b>${m.expectedR.toFixed(2)}R</b>
                    </div>
                    <div>
                        <small>Risk</small>
                        <b>${pct(m.risk)}</b>
                    </div>
                </div>

                <div class="ai-commander-metrics">
                    ${renderBar("Trend", m.trend)}
                    ${renderBar("Momentum", m.momentum)}
                    ${renderBar("Structure", m.structure)}
                    ${renderBar("Liquidity", m.liquidity)}
                    ${renderBar("Portfolio Fit", m.portfolioFit)}
                    ${renderBar("Opportunity", m.opportunity)}
                </div>

                <div class="ai-commander-narrative">
                    <b>Commander Narrative</b>
                    <span>${m.symbol} is classified as ${m.classification}. Current command is ${m.recommendation}. Do not execute unless confirmation, risk control, and broker readiness remain aligned.</span>
                </div>
            </section>
        `;
    }

    window.EventBus?.subscribe?.("decision.updated", renderAITradingCommander);
    window.EventBus?.subscribe?.("unified-opportunity.changed", () => setTimeout(renderAITradingCommander, 50));
    window.EventBus?.subscribe?.("scanner.selection.changed", renderAITradingCommander);
    document.addEventListener("DOMContentLoaded", () => setTimeout(renderAITradingCommander, 1200));

    window.AITradingCommanderPanel = {
        renderAITradingCommander,
        version: VERSION
    };
})();
