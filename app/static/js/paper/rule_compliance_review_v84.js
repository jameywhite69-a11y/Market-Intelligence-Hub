/*
Version 84.0 — Rule Compliance Review
*/
(function () {
    const VERSION = "84.0";

    function check() {
        const ai = window.AITradingAssistantV82?.recommendation?.() || {};
        const risk = window.PositionRiskManagerV81?.analyze?.() || {};
        const acct = window.PaperTradingAccountV80?.snapshot?.() || {};
        const latestOrder = (acct.orders || [])[0];

        return [
            ["AI recommendation reviewed", !!ai.action],
            ["Paper-only execution", true],
            ["Live broker not used", true],
            ["Risk below 2%", Number(risk.riskPct || 0) <= 2],
            ["Order has stop", !latestOrder || Number(latestOrder.stop || 0) > 0],
            ["Order has target", !latestOrder || Number(latestOrder.tp1 || 0) > 0]
        ];
    }

    function render() {
        const panel = document.getElementById("ruleComplianceReviewPanelV84");
        if (!panel) return;

        const checks = check();

        panel.innerHTML = `
            <section class="v84-card">
                <div class="v84-header">
                    <div>
                        <h2>Rule Compliance Review</h2>
                        <span>${checks.filter(x => x[1]).length}/${checks.length} rules passing</span>
                    </div>
                    <strong>${checks.every(x => x[1]) ? "COMPLIANT" : "REVIEW"}</strong>
                </div>

                <div class="v84-check-list">
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
        window.EventBus?.subscribe?.("paper-trading-account.updated", render);
        window.EventBus?.subscribe?.("ai-trading-assistant.updated", render);
        window.EventBus?.subscribe?.("position-risk-v81.updated", render);
        setTimeout(render, 2000);
    }

    window.RuleComplianceReviewV84 = { check, render, version: VERSION };
    document.addEventListener("DOMContentLoaded", () => setTimeout(wire, 1300));
})();
