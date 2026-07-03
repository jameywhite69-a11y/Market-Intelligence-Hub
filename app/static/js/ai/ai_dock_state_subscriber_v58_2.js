/*
Version 58.2 — AI Dock State Subscriber
Purpose:
- Replaces AI dock repaint/freeze behavior with one render per selected opportunity.
- Updates the AI tab when the selected symbol changes.
- Ignores duplicate same-symbol/same-score updates.
- Keeps diagnostics/audit independent from main AI decision summary.
- UI/state only. No broker execution.
*/
(function () {
    const VERSION = "58.2";
    let lastRenderKey = "";

    function activeAiPanel() {
        return document.querySelector('[data-dock-panel="ai"]');
    }

    function normalize(payload) {
        const value = payload?.value || payload || {};
        const symbol = value.symbol || window.UnifiedDecisionEngineV57?.get?.()?.symbol || "—";
        const timeframe = value.timeframe || value.tf || window.UnifiedDecisionEngineV57?.get?.()?.timeframe || "—";
        const score = Number(value.score ?? value.opportunityScore ?? value.validationScore ?? window.UnifiedDecisionEngineV57?.get?.()?.score ?? 0);
        const confidence = Number(value.confidence ?? value.confidenceScore ?? window.UnifiedDecisionEngineV57?.get?.()?.confidence ?? 0);
        const decision = value.decision || window.UnifiedDecisionEngineV57?.get?.()?.decision || "Waiting";
        const expectedR = Number(value.expectedR ?? value.expectedReward ?? window.UnifiedDecisionEngineV57?.get?.()?.expectedR ?? 0);
        const allocation = Number(value.allocation ?? value.allocationPct ?? window.UnifiedDecisionEngineV57?.get?.()?.allocation ?? 0);

        return {
            symbol,
            timeframe,
            score: Number.isFinite(score) ? score : 0,
            confidence: Number.isFinite(confidence) ? confidence : 0,
            decision,
            expectedR: Number.isFinite(expectedR) ? expectedR : 0,
            allocation: Number.isFinite(allocation) ? allocation : 0,
            timestamp: new Date().toLocaleTimeString()
        };
    }

    function key(model) {
        return `${model.symbol}|${model.timeframe}|${model.score.toFixed(1)}|${model.decision}`;
    }

    function ensureShell(panel) {
        let shell = panel.querySelector("#aiDockStateSubscriberPanel");
        if (shell) return shell;

        shell = document.createElement("section");
        shell.id = "aiDockStateSubscriberPanel";
        shell.className = "ai-dock-state-card";

        panel.insertBefore(shell, panel.firstChild);
        return shell;
    }

    function render(payload, source = "state") {
        const panel = activeAiPanel();
        if (!panel) return;

        const model = normalize(payload);
        const nextKey = key(model);

        if (nextKey === lastRenderKey) return;
        lastRenderKey = nextKey;

        const shell = ensureShell(panel);

        shell.innerHTML = `
            <div class="ai-dock-state-header">
                <div>
                    <h2>Institutional AI Decision</h2>
                    <span>${model.symbol} · ${model.timeframe} · ${source}</span>
                </div>
                <strong>${model.decision}</strong>
            </div>

            <div class="ai-dock-state-grid">
                <div><small>Score</small><b>${model.score.toFixed(1)}</b></div>
                <div><small>Confidence</small><b>${model.confidence.toFixed(1)}%</b></div>
                <div><small>Expected R</small><b>${model.expectedR.toFixed(2)}R</b></div>
                <div><small>Allocation</small><b>${model.allocation.toFixed(1)}%</b></div>
            </div>

            <div class="ai-dock-state-note">
                <b>${model.symbol}</b>
                <span>Decision updated once from selected opportunity state. Audit log remains independent to avoid repaint loops.</span>
            </div>
        `;

        panel.dataset.aiDockStateSubscriber = VERSION;
    }

    function wire() {
        window.EventBus?.subscribe?.("scanner.selection.changed", payload => render(payload, "scanner.selection"));
        window.EventBus?.subscribe?.("institutional-decision.updated", payload => render(payload, "institutional.decision"));
        window.EventBus?.subscribe?.("unified-opportunity.changed", payload => {
            if (payload?.value) render(payload.value, "unified.opportunity");
        });

        setTimeout(() => {
            const current = window.UnifiedDecisionEngineV57?.get?.();
            if (current) render(current, "initial");
        }, 600);
    }

    function disableOldFreeze() {
        if (window.AIDockStabilityControllerV581) {
            window.AIDockStabilityControllerV581.disabledByV582 = true;
        }
        document.body.dataset.aiDockFreezeDisabledBy = VERSION;
    }

    function init() {
        disableOldFreeze();
        wire();
        document.body.dataset.aiDockStateSubscriber = VERSION;
        console.log("[TIOS AI Dock State Subscriber]", { version: VERSION });
    }

    window.AIDockStateSubscriberV582 = {
        init,
        render,
        version: VERSION
    };

    document.addEventListener("DOMContentLoaded", () => setTimeout(init, 1400));
})();
