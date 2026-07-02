/*
Version 55.0 — Institutional Package Terminal Formatter
Formats institutional package panel as analyst report without changing backend data.
*/
(function () {
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

    function render() {
        const panel = document.getElementById("institutionalPackageReportPanel");
        if (!panel) return;

        const d = current();
        const symbol = d.symbol || window.ScannerSelectionUnifier?.current?.()?.symbol || "ETH";
        const score = n(d.score ?? d.validationScore ?? d.opportunityScore, 71.8);
        const confidence = n(d.confidence ?? d.confidenceScore, 73.3);
        const expectedR = n(d.expectedR ?? d.expectedReward, 2.4);
        const allocation = n(d.allocation ?? d.allocationPct, 16.7);
        const action = score >= 85 ? "EXECUTE" : score >= 72 ? "WAIT" : "STAND DOWN";

        panel.innerHTML = `
            <section class="institutional-report-card">
                <div class="report-header">
                    <h2>Institutional Decision Package</h2>
                    <span>${symbol} · Analyst Report</span>
                </div>

                <div class="report-summary">
                    <b>${action}</b>
                    <span>Preserve capital unless confirmation improves.</span>
                </div>

                <div class="report-grid">
                    <div><small>Decision Score</small><b>${score.toFixed(1)}</b></div>
                    <div><small>Confidence</small><b>${confidence.toFixed(1)}%</b></div>
                    <div><small>Expected Return</small><b>${expectedR.toFixed(2)}R</b></div>
                    <div><small>Allocation</small><b>${allocation.toFixed(1)}%</b></div>
                    <div><small>Priority</small><b>${score >= 85 ? "High" : "Low"}</b></div>
                    <div><small>Risk Review</small><b>${score >= 72 ? "Required" : "Avoid"}</b></div>
                </div>

                <div class="report-note">
                    <b>Institutional Summary</b>
                    <span>${symbol} should not be executed until scanner, consensus, risk, and portfolio fit remain aligned.</span>
                </div>
            </section>
        `;
    }

    window.EventBus?.subscribe?.("decision.updated", render);
    window.EventBus?.subscribe?.("unified-opportunity.changed", () => setTimeout(render, 50));
    document.addEventListener("DOMContentLoaded", () => setTimeout(render, 1200));

    window.InstitutionalPackageTerminalV55 = { render };
})();
