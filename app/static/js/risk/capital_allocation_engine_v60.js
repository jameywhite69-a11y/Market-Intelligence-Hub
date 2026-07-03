/*
Version 60.0 — Capital Allocation Engine
Paper-only allocation recommendation based on quality, risk, and exposure.
*/
(function () {
    const VERSION = "60.0";

    function calculate(workflow) {
        workflow = workflow || window.ExecutionWorkflowEngineV60?.get?.() || {};
        const score = Number(workflow.score || 60);
        const risk = Number(workflow.riskDollars || 0);
        const exposure = Number(workflow.notional || 0) / 100000 * 100;

        const qualityAllocation =
            score >= 92 ? 20 :
            score >= 86 ? 15 :
            score >= 80 ? 10 :
            score >= 72 ? 6 :
            0;

        const riskAdjustment = risk > 750 ? -5 : risk > 500 ? -2 : 0;
        const exposureAdjustment = exposure > 30 ? -6 : exposure > 20 ? -3 : 0;
        const finalAllocation = Math.max(0, qualityAllocation + riskAdjustment + exposureAdjustment);

        return {
            symbol: workflow.symbol || "—",
            score,
            risk,
            exposure,
            qualityAllocation,
            riskAdjustment,
            exposureAdjustment,
            finalAllocation,
            status: finalAllocation >= 10 ? "Approved" : finalAllocation > 0 ? "Reduced" : "Blocked"
        };
    }

    function render(payload) {
        const panel = document.getElementById("capitalAllocationEnginePanel");
        if (!panel) return;

        const allocation = calculate(payload?.workflow || payload);

        panel.innerHTML = `
            <section class="v60-allocation-card">
                <div class="v60-header">
                    <div>
                        <h2>Capital Allocation Engine</h2>
                        <span>${allocation.symbol}</span>
                    </div>
                    <strong>${allocation.status}</strong>
                </div>

                <div class="v60-summary-grid">
                    <div><small>Quality</small><b>${allocation.qualityAllocation.toFixed(1)}%</b></div>
                    <div><small>Risk Adj.</small><b>${allocation.riskAdjustment.toFixed(1)}%</b></div>
                    <div><small>Exposure Adj.</small><b>${allocation.exposureAdjustment.toFixed(1)}%</b></div>
                    <div><small>Final Allocation</small><b>${allocation.finalAllocation.toFixed(1)}%</b></div>
                </div>
            </section>
        `;
    }

    function wire() {
        window.EventBus?.subscribe?.("execution-workflow.updated", render);
        setTimeout(() => render(), 1600);
    }

    window.CapitalAllocationEngineV60 = { calculate, render, version: VERSION };
    document.addEventListener("DOMContentLoaded", () => setTimeout(wire, 1100));
})();
