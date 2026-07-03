/*
Version 62.0 — Market Context AI Bridge
Adjusts AI command confidence based on market context.
No orders.
*/
(function () {
    const VERSION = "62.0";
    const STATE = { last: null };

    function getDecision() {
        return window.UnifiedDecisionEngineV57?.get?.() || {};
    }

    function build(context) {
        const d = getDecision();
        const baseConfidence = Number(d.confidence || 70);
        const score = Number(context?.contextScore || 60);

        let adjustment = 0;
        if (context?.regime === "Risk-On Trend") adjustment = 8;
        else if (context?.regime === "Range / Rotation") adjustment = -3;
        else if (context?.regime === "Narrow / Fragile") adjustment = -8;
        else if (context?.regime === "Low Liquidity") adjustment = -12;
        else if (context?.regime === "Risk-Off") adjustment = -18;

        const adjustedConfidence = Math.max(0, Math.min(100, baseConfidence + adjustment));
        const permission = context?.tradePermission || "Normal Watch";

        return {
            version: VERSION,
            symbol: d.symbol || "—",
            decision: d.decision || "WAIT",
            regime: context?.regime || "Neutral",
            permission,
            baseConfidence,
            adjustment,
            adjustedConfidence,
            contextScore: score,
            recommendation:
                permission === "Defense Only" ? "Suppress New Trades" :
                permission === "Reduce / Avoid" ? "Reduce Risk" :
                permission === "Reduced Size" ? "Half Size Only" :
                permission === "Selective Only" ? "Confirm Setup" :
                "Proceed With Rules"
        };
    }

    function render(model = STATE.last) {
        const panel = document.getElementById("marketContextAIBridgePanel");
        if (!panel || !model) return;

        panel.innerHTML = `
            <section class="v62-ai-bridge-card">
                <div class="v62-header">
                    <div>
                        <h2>AI Market Context Bridge</h2>
                        <span>${model.symbol} · ${model.regime}</span>
                    </div>
                    <strong>${model.recommendation}</strong>
                </div>

                <div class="v62-context-grid">
                    <div><small>Base Conf.</small><b>${model.baseConfidence.toFixed(1)}%</b></div>
                    <div><small>Adjustment</small><b>${model.adjustment > 0 ? "+" : ""}${model.adjustment.toFixed(1)}%</b></div>
                    <div><small>Adjusted</small><b>${model.adjustedConfidence.toFixed(1)}%</b></div>
                    <div><small>Permission</small><b>${model.permission}</b></div>
                </div>

                <div class="v62-note">
                    <b>AI Context Rule</b>
                    <span>Symbol-level setups are filtered by the current market regime before execution planning.</span>
                </div>
            </section>
        `;
    }

    function update(payload) {
        const context = payload?.context || payload;
        STATE.last = build(context);
        window.EventBus?.publish?.("ai-market-context.updated", STATE.last);
        render(STATE.last);
    }

    function wire() {
        window.EventBus?.subscribe?.("market-context.updated", update);
        window.EventBus?.subscribe?.("institutional-market-context.updated", update);
        setTimeout(() => {
            const context = window.InstitutionalMarketContextEngineV62?.get?.();
            if (context) update(context);
        }, 1900);
    }

    window.MarketContextAIBridgeV62 = { build, update, render, version: VERSION };
    document.addEventListener("DOMContentLoaded", () => setTimeout(wire, 1200));
})();
