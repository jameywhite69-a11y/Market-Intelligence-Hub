/*
Version 70.0 — Release Candidate Dashboard
Purpose:
- Summarize workstation readiness for a production-style release candidate.
- Checks module presence, mode, broker safety, automation safety, and known issues.
- No live broker execution.
*/
(function () {
    const VERSION = "70.0";

    const MODULES = [
        ["Market Context Store", "MarketContextStoreV63"],
        ["Portfolio Store", "PortfolioIntelligenceStoreV64"],
        ["Execution Service", "ExecutionServiceV65"],
        ["Live Order Manager", "LiveOrderManagerV66"],
        ["Performance Analytics", "PerformanceAnalyticsEngineV67"],
        ["AI Trade Review", "AITradeReviewEngineV68"],
        ["Workflow Automation", "WorkflowAutomationEngineV69"]
    ];

    function check() {
        const modules = MODULES.map(([label, key]) => ({
            label,
            key,
            ok: typeof window[key] === "object" || typeof window[key] === "function"
        }));

        const execution = window.ExecutionServiceV65?.snapshot?.() || {};
        const automation = window.WorkflowAutomationEngineV69?.snapshot?.() || {};
        const liveDisabled = execution.mode !== "live";
        const automationSafe = automation.enabled !== true;

        const passed = modules.filter(m => m.ok).length + (liveDisabled ? 1 : 0) + (automationSafe ? 1 : 0);
        const total = modules.length + 2;

        return {
            version: VERSION,
            modules,
            liveDisabled,
            automationSafe,
            passed,
            total,
            status: passed === total ? "Release Candidate Ready" : "Needs Review",
            knownIssues: [
                "AI Opportunity panel may flicker in one dock view; tracked as cosmetic.",
                "Live broker routing remains intentionally disabled.",
                "Paper execution is available for testing."
            ]
        };
    }

    function render() {
        const panel = document.getElementById("releaseCandidateDashboardV70Panel");
        if (!panel) return;

        const c = check();

        panel.innerHTML = `
            <section class="v70-card">
                <div class="v70-header">
                    <div>
                        <h2>Release Candidate Dashboard</h2>
                        <span>Version 70.0 · platform readiness</span>
                    </div>
                    <strong>${c.status}</strong>
                </div>

                <div class="v70-score">
                    <b>${c.passed}/${c.total}</b>
                    <span>readiness checks passed</span>
                </div>

                <div class="v70-check-list">
                    ${c.modules.map(m => `
                        <div class="${m.ok ? "pass" : "fail"}">
                            <b>${m.ok ? "✓" : "!"}</b>
                            <span>${m.label}</span>
                        </div>
                    `).join("")}
                    <div class="${c.liveDisabled ? "pass" : "fail"}"><b>${c.liveDisabled ? "✓" : "!"}</b><span>Live Broker Disabled</span></div>
                    <div class="${c.automationSafe ? "pass" : "fail"}"><b>${c.automationSafe ? "✓" : "!"}</b><span>Automation Requires Manual Enable</span></div>
                </div>

                <div class="v70-note">
                    <b>Known Issues</b>
                    ${c.knownIssues.map(i => `<span>${i}</span>`).join("")}
                </div>
            </section>
        `;
    }

    function wire() {
        window.EventBus?.subscribe?.("workflow-automation.updated", render);
        window.EventBus?.subscribe?.("execution-service.order-staged", render);
        setTimeout(render, 1800);
    }

    window.ReleaseCandidateDashboardV70 = { check, render, version: VERSION };
    document.addEventListener("DOMContentLoaded", () => setTimeout(wire, 1000));
})();
