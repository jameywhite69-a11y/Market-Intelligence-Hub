(function () {
    function renderInstitutionalDecisionCard() {
        const panel = document.getElementById("institutionalDecisionCardPanel");
        if (!panel) return;

        const decision = window.DecisionEngine?.current?.() || window.WorkspaceStore?.get?.("currentDecision");

        if (!decision) {
            panel.innerHTML = `
                <section class="institutional-decision-card">
                    <div class="terminal-card-header">
                        <h3>Institutional Decision</h3>
                        <span>Waiting</span>
                    </div>
                    <p class="muted">Select an opportunity to generate institutional decision context.</p>
                </section>`;
            return;
        }

        const score = decision.institutionalScore || {};
        const opportunity = decision.opportunity || {};

        panel.innerHTML = `
            <section class="institutional-decision-card ${String(decision.recommendation).toLowerCase().replaceAll(" ", "-")}">
                <div class="terminal-card-header">
                    <h3>Institutional Decision</h3>
                    <span>${decision.recommendation}</span>
                </div>

                <div class="institutional-decision-main">
                    <div>
                        <b>${decision.symbol}</b>
                        <span>${decision.timeframe} · ${decision.strategy}</span>
                    </div>
                    <strong>${score.overall || 0}<small>${score.grade || "—"}</small></strong>
                </div>

                <div class="institutional-decision-grid">
                    <div><b>Confidence</b><span>${Number(decision.confidence || 0).toFixed(1)}%</span></div>
                    <div><b>Expected R</b><span>${Number(opportunity.expectedR || 0).toFixed(2)}R</span></div>
                    <div><b>Allocation</b><span>$${Number(opportunity.allocation || 0).toFixed(0)}</span></div>
                    <div><b>Execution</b><span>${score.execution || 0}</span></div>
                    <div><b>Risk</b><span>${score.risk || 0}</span></div>
                    <div><b>Portfolio</b><span>${score.portfolioFit || 0}</span></div>
                </div>

                <p class="institutional-decision-text">${decision.narrative}</p>
            </section>
        `;
    }

    window.EventBus?.subscribe?.("decision.updated", renderInstitutionalDecisionCard);
    window.EventBus?.subscribe?.("unified-opportunity.changed", () => setTimeout(renderInstitutionalDecisionCard, 50));
    document.addEventListener("DOMContentLoaded", () => setTimeout(renderInstitutionalDecisionCard, 1250));

    window.InstitutionalDecisionCard = {
        renderInstitutionalDecisionCard
    };
})();
