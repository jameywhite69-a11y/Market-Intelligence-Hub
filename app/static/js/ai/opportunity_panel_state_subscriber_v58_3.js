/*
Version 58.3 — Opportunity Panel Stability Hotfix
Purpose:
- Stops the Opportunity Intelligence card in the AI tab from flickering.
- Converts the opportunity card into a stable state subscriber.
- Renders only when selected symbol/timeframe/score actually changes.
- UI/state only. No broker execution.
*/
(function () {
    const VERSION = "58.3";
    let lastKey = "";
    let renderTimer = null;

    function findPanel() {
        return document.getElementById("opportunityPanel")
            || document.querySelector(".opportunity-panel")
            || document.querySelector(".workstation-ai-panel");
    }

    function normalize(payload) {
        const value = payload?.value || payload || {};
        const fallback = window.UnifiedDecisionEngineV57?.get?.() || {};

        const symbol = value.symbol || fallback.symbol || "ETH";
        const timeframe = value.timeframe || value.tf || fallback.timeframe || "15m";
        const score = Number(value.score ?? value.opportunityScore ?? value.validationScore ?? fallback.score ?? 68);
        const confidence = Number(value.confidence ?? value.confidenceScore ?? fallback.confidence ?? score);
        const decision = value.decision || fallback.decision || "WATCH";
        const risk = value.risk || value.riskLabel || (Number(value.riskScore ?? fallback.metrics?.risk ?? 42) <= 55 ? "Moderate" : "Elevated");
        const strategy = value.strategy || value.strategyName || "Confirmation Required";
        const direction = value.direction || (decision === "AVOID" ? "STAND DOWN" : "LONG");

        return {
            symbol,
            timeframe,
            score: Number.isFinite(score) ? score : 68,
            confidence: Number.isFinite(confidence) ? confidence : 68,
            decision,
            risk,
            strategy,
            direction
        };
    }

    function renderNow(model) {
        const panel = findPanel();
        if (!panel) return;

        const key = `${model.symbol}|${model.timeframe}|${model.score.toFixed(1)}|${model.decision}|${model.strategy}`;
        if (key === lastKey) return;
        lastKey = key;

        panel.dataset.opportunityStable = VERSION;
        panel.innerHTML = `
            <section class="v583-opportunity-card">
                <div class="v583-opportunity-header">
                    <div>
                        <h2>Opportunity Intelligence</h2>
                        <span>${model.decision === "READY" ? "Execution Candidate" : "Watchlist Candidate"} · ${model.score.toFixed(1)}</span>
                    </div>
                    <strong>${model.score.toFixed(1)}</strong>
                </div>

                <div class="v583-opportunity-symbol">
                    <div>
                        <b>${model.symbol} ${model.timeframe}</b>
                        <span>Developing · ${model.strategy}</span>
                    </div>
                    <em>${model.confidence.toFixed(1)}</em>
                </div>

                <div class="v583-opportunity-note">
                    <b>${model.decision}</b>
                    <span>${model.symbol} should remain on watch until confirmation, risk, and strategy alignment remain valid.</span>
                </div>

                <div class="v583-opportunity-grid">
                    <div><small>Direction</small><b>${model.direction}</b></div>
                    <div><small>Risk</small><b>${model.risk}</b></div>
                    <div><small>Rating</small><b>${model.decision}</b></div>
                    <div><small>Strategy</small><b>${model.strategy}</b></div>
                </div>
            </section>
        `;
    }

    function scheduleRender(payload, source) {
        const model = normalize(payload);

        if (renderTimer) {
            clearTimeout(renderTimer);
        }

        renderTimer = setTimeout(() => {
            renderTimer = null;
            renderNow(model, source);
        }, 80);
    }

    function disableLegacyOpportunityRenderers() {
        const panel = findPanel();
        if (!panel) return;

        panel.dataset.v583OwnsOpportunityPanel = "true";

        const observer = new MutationObserver(() => {
            if (panel.dataset.v583InternalWrite === "true") return;

            const legacy = panel.querySelector(".opportunity-card, .terminal-opportunity-card, .opportunity-intelligence-card");
            if (!legacy) return;

            const current = window.UnifiedDecisionEngineV57?.get?.();
            if (current) {
                panel.dataset.v583InternalWrite = "true";
                renderNow(current);
                setTimeout(() => {
                    panel.dataset.v583InternalWrite = "false";
                }, 0);
            }
        });

        observer.observe(panel, { childList: true, subtree: true });
    }

    function wire() {
        window.EventBus?.subscribe?.("scanner.selection.changed", payload => scheduleRender(payload, "scanner.selection"));
        window.EventBus?.subscribe?.("institutional-decision.updated", payload => scheduleRender(payload, "institutional.decision"));
        window.EventBus?.subscribe?.("unified-opportunity.changed", payload => scheduleRender(payload?.value || payload, "unified.opportunity"));

        setTimeout(() => {
            const current = window.UnifiedDecisionEngineV57?.get?.();
            if (current) renderNow(current);
        }, 600);
    }

    function init() {
        disableLegacyOpportunityRenderers();
        wire();
        document.body.dataset.opportunityPanelStability = VERSION;
        console.log("[TIOS Opportunity Panel Stability]", { version: VERSION });
    }

    window.OpportunityPanelStateSubscriberV583 = {
        init,
        render: scheduleRender,
        version: VERSION
    };

    document.addEventListener("DOMContentLoaded", () => setTimeout(init, 1600));
})();
