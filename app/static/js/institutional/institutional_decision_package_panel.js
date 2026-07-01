(function () {
    function renderInstitutionalDecisionPackagePanel() {
        const panel = document.getElementById("institutionalDecisionPackagePanel");
        if (!panel) return;

        const pkg = window.InstitutionalDecisionPackage?.current?.();

        if (!pkg) {
            panel.innerHTML = `
                <section class="idp-card">
                    <div class="terminal-card-header">
                        <h3>Institutional Decision Package</h3>
                        <span>Waiting</span>
                    </div>
                    <p class="muted">Select an opportunity to create the institutional decision package.</p>
                </section>`;
            return;
        }

        panel.innerHTML = `
            <section class="idp-card ${String(pkg.recommendation).toLowerCase()}">
                <div class="terminal-card-header">
                    <h3>Institutional Decision Package</h3>
                    <span>${pkg.entryStatus}</span>
                </div>

                <div class="idp-hero">
                    <div>
                        <b>${pkg.symbol}</b>
                        <span>${pkg.timeframe} · ${pkg.strategy}</span>
                    </div>
                    <strong>${pkg.institutionalScore}<small>${pkg.grade}</small></strong>
                </div>

                <div class="idp-grid">
                    <div><b>Confidence</b><span>${Number(pkg.confidence).toFixed(1)}%</span></div>
                    <div><b>Expected R</b><span>${Number(pkg.expectedR).toFixed(2)}R</span></div>
                    <div><b>Risk</b><span>${pkg.riskLevel}</span></div>
                    <div><b>Allocation</b><span>$${Number(pkg.allocation).toFixed(0)}</span></div>
                    <div><b>Consensus</b><span>${pkg.strategyConsensus.passCount}/${pkg.strategyConsensus.total}</span></div>
                    <div><b>Alignment</b><span>${pkg.strategyConsensus.alignment}%</span></div>
                    <div><b>Rank Score</b><span>${pkg.ranking.rankScore}</span></div>
                    <div><b>Priority</b><span>${pkg.ranking.capitalPriority}</span></div>
                </div>

                <div class="idp-summary">
                    <b>Institutional Summary</b>
                    <p>${pkg.summary}</p>
                </div>
            </section>`;
    }

    window.EventBus?.subscribe?.("institutional-decision-package.updated", renderInstitutionalDecisionPackagePanel);
    window.EventBus?.subscribe?.("institutional-score.updated", () => setTimeout(renderInstitutionalDecisionPackagePanel, 150));
    document.addEventListener("DOMContentLoaded", () => setTimeout(renderInstitutionalDecisionPackagePanel, 1700));

    window.InstitutionalDecisionPackagePanel = {
        renderInstitutionalDecisionPackagePanel,
    };
})();
