/*
Version 55.0 — Trade Execution Planner
Creates a production execution plan from current opportunity / decision context.
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

    function symbol() {
        return current().symbol || window.ScannerSelectionUnifier?.current?.()?.symbol || "ETH";
    }

    function tf() {
        return current().timeframe || window.ScannerSelectionUnifier?.current?.()?.timeframe || "1h";
    }

    function model() {
        const d = current();
        const score = n(d.score ?? d.opportunityScore ?? d.validationScore, 73.3);
        const confidence = n(d.confidence ?? d.confidenceScore, 73.3);
        const expectedR = n(d.expectedR ?? d.expectedReward, 2.4);

        const entry = n(d.entry ?? d.idealEntry, 199.40);
        const stop = n(d.stop ?? d.stopLoss, 193.10);
        const tp1 = n(d.tp1 ?? d.takeProfit1, 203.60);
        const tp2 = n(d.tp2 ?? d.takeProfit2, 206.80);

        const action =
            score >= 85 && confidence >= 80 ? "READY" :
            score >= 72 ? "WAIT" :
            score >= 60 ? "WATCH" :
            "AVOID";

        return {
            symbol: symbol(),
            timeframe: tf(),
            score,
            confidence,
            expectedR,
            entry,
            stop,
            tp1,
            tp2,
            action,
            riskPerTrade: "0.50%",
            allocation: score >= 85 ? "Full tactical allocation" : score >= 72 ? "Half allocation only after confirmation" : "No allocation"
        };
    }

    function render() {
        const panel = document.getElementById("tradeExecutionPlannerPanel");
        if (!panel) return;

        const m = model();
        panel.innerHTML = `
            <section class="trade-execution-planner">
                <div class="planner-header">
                    <div>
                        <h2>Trade Execution Planner</h2>
                        <span>${m.symbol} · ${m.timeframe}</span>
                    </div>
                    <strong>${m.action}</strong>
                </div>

                <div class="planner-route">
                    <div><b>1</b><span>Validate Signal</span><em>${m.score.toFixed(1)}</em></div>
                    <div><b>2</b><span>Confirm Risk</span><em>${m.riskPerTrade}</em></div>
                    <div><b>3</b><span>Stage Order</span><em>${m.action}</em></div>
                    <div><b>4</b><span>Manage Exit</span><em>${m.expectedR.toFixed(2)}R</em></div>
                </div>

                <div class="planner-levels">
                    <div><small>Entry</small><b>${m.entry.toFixed(2)}</b></div>
                    <div><small>Stop</small><b>${m.stop.toFixed(2)}</b></div>
                    <div><small>TP1</small><b>${m.tp1.toFixed(2)}</b></div>
                    <div><small>TP2</small><b>${m.tp2.toFixed(2)}</b></div>
                </div>

                <div class="planner-guidance">
                    <b>Execution Guidance</b>
                    <span>${m.allocation}. Paper execution should remain enabled until live broker validation is complete.</span>
                </div>
            </section>
        `;
    }

    window.EventBus?.subscribe?.("decision.updated", render);
    window.EventBus?.subscribe?.("unified-opportunity.changed", () => setTimeout(render, 50));
    window.EventBus?.subscribe?.("scanner.selection.changed", render);
    document.addEventListener("DOMContentLoaded", () => setTimeout(render, 1500));

    window.TradeExecutionPlannerV55 = { render, version: VERSION };
})();
