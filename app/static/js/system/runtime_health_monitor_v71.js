/*
Version 71.0 — Runtime Health Monitor
Checks global module availability and missing panel targets.
*/
(function () {
    const VERSION = "71.0";

    const CHECKS = [
        ["Context Store", "MarketContextStoreV63"],
        ["Portfolio Store", "PortfolioIntelligenceStoreV64"],
        ["Execution Service", "ExecutionServiceV65"],
        ["Live Orders", "LiveOrderManagerV66"],
        ["Analytics", "PerformanceAnalyticsEngineV67"],
        ["Automation", "WorkflowAutomationEngineV69"],
        ["Release Candidate", "ReleaseCandidateDashboardV70"]
    ];

    function check() {
        const modules = CHECKS.map(([name, global]) => ({
            name,
            global,
            ok: !!window[global]
        }));

        const panels = [
            "productionPolishPanelV71",
            "runtimeHealthMonitorPanelV71",
            "releaseCandidateDashboardV70Panel"
        ].map(id => ({ id, ok: !!document.getElementById(id) }));

        return {
            version: VERSION,
            modules,
            panels,
            passed: modules.filter(x => x.ok).length + panels.filter(x => x.ok).length,
            total: modules.length + panels.length
        };
    }

    function render() {
        const panel = document.getElementById("runtimeHealthMonitorPanelV71");
        if (!panel) return;

        const c = check();

        panel.innerHTML = `
            <section class="v71-card">
                <div class="v71-header">
                    <div>
                        <h2>Runtime Health Monitor</h2>
                        <span>${c.passed}/${c.total} checks passing</span>
                    </div>
                    <strong>${c.passed === c.total ? "HEALTHY" : "REVIEW"}</strong>
                </div>

                <div class="v71-check-list">
                    ${c.modules.map(m => `
                        <div class="${m.ok ? "pass" : "fail"}">
                            <b>${m.ok ? "✓" : "!"}</b>
                            <span>${m.name}</span>
                        </div>
                    `).join("")}
                </div>
            </section>
        `;
    }

    window.RuntimeHealthMonitorV71 = { check, render, version: VERSION };
    document.addEventListener("DOMContentLoaded", () => setTimeout(render, 2400));
})();
