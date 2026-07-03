/*
Version 69.0 — Alert Rule Builder
Builds human-readable automation/alert rules for future webhook integration.
*/
(function () {
    const VERSION = "69.0";

    function buildRules() {
        const ctx = window.MarketContextStoreV63?.get?.() || {};
        const selected = ctx.selected || {};
        const market = ctx.marketContext || {};
        return [
            `Alert when ${selected.symbol || "selected symbol"} score >= 90 and confidence >= 80.`,
            `Block alerts when market permission is ${market.tradePermission || "Defense Only"}.`,
            "Reduce size when portfolio heat is elevated.",
            "Require manual approval before any live broker submission."
        ];
    }

    function render() {
        const panel = document.getElementById("alertRuleBuilderPanelV69");
        if (!panel) return;

        const rules = buildRules();

        panel.innerHTML = `
            <section class="v69-card">
                <div class="v69-header">
                    <div>
                        <h2>Alert Rule Builder</h2>
                        <span>automation-ready rule templates</span>
                    </div>
                    <strong>${rules.length}</strong>
                </div>

                <div class="v69-event-list">
                    ${rules.map(rule => `<div><b>Rule</b><span>${rule}</span></div>`).join("")}
                </div>
            </section>
        `;
    }

    function wire() {
        window.EventBus?.subscribe?.("market-context-store.updated", render);
        setTimeout(render, 2100);
    }

    window.AlertRuleBuilderV69 = { buildRules, render, version: VERSION };
    document.addEventListener("DOMContentLoaded", () => setTimeout(wire, 1300));
})();
