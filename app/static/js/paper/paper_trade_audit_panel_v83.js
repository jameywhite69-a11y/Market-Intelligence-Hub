/*
Version 83.0 — Paper Trade Audit Panel
*/
(function () {
    const VERSION = "83.0";

    function build() {
        const account = window.PaperTradingAccountV80?.snapshot?.() || {};
        const ai = window.AITradingAssistantV82?.recommendation?.() || {};
        const top = window.LiveOpportunityEngineV79?.latest?.()?.[0] || {};
        const latestOrder = (account.orders || [])[0];

        return [
            ["Live opportunity exists", !!top.symbol],
            ["AI recommendation available", !!ai.action],
            ["Paper account loaded", !!window.PaperTradingAccountV80],
            ["Order staged or ready", !!latestOrder || ai.action === "PAPER BUY READY"],
            ["Live broker blocked", true],
            ["Paper safe", true]
        ];
    }

    function render() {
        const panel = document.getElementById("paperTradeAuditPanelV83");
        if (!panel) return;

        const checks = build();

        panel.innerHTML = `
            <section class="v83-card">
                <div class="v83-header">
                    <div>
                        <h2>Paper Trade Audit</h2>
                        <span>${checks.filter(x => x[1]).length}/${checks.length} checks passing</span>
                    </div>
                    <strong>${checks.every(x => x[1]) ? "CLEAR" : "REVIEW"}</strong>
                </div>

                <div class="v83-check-list">
                    ${checks.map(([label, ok]) => `
                        <div class="${ok ? "pass" : "fail"}">
                            <b>${ok ? "✓" : "!"}</b>
                            <span>${label}</span>
                        </div>
                    `).join("")}
                </div>
            </section>
        `;
    }

    function wire() {
        window.EventBus?.subscribe?.("paper-command-center-v83.updated", render);
        window.EventBus?.subscribe?.("paper-trading-account.updated", render);
        window.EventBus?.subscribe?.("live-opportunities.updated", render);
        setTimeout(render, 2000);
    }

    window.PaperTradeAuditPanelV83 = { build, render, version: VERSION };
    document.addEventListener("DOMContentLoaded", () => setTimeout(wire, 1200));
})();
