(function () {
    function valueOrDash(value) {
        return value === undefined || value === null || value === "" ? "—" : value;
    }

    function money(value) {
        return `$${Number(value || 0).toFixed(2)}`;
    }

    function renderCommandCenterPanel(state = window.CommandCenterStore?.snapshot?.()) {
        const panel = document.getElementById("institutionalCommandCenterPanel");
        if (!panel) return;

        const opp = state?.selectedOpportunity;
        const ai = state?.aiDecision;
        const risk = state?.riskAssessment;
        const portfolio = state?.portfolio;
        const readiness = state?.readiness || "Waiting";

        panel.innerHTML = `
            <section class="command-center-card ${String(readiness).toLowerCase().replaceAll(" ", "-")}">
                <div class="command-center-header">
                    <div>
                        <h2>Institutional Command Center</h2>
                        <span>Market Intelligence Hub Professional · 43.0</span>
                    </div>
                    <strong>${readiness}</strong>
                </div>

                <div class="command-center-primary">
                    <div>
                        <b>Current Opportunity</b>
                        <span>${opp ? `${opp.symbol} · ${opp.timeframe}` : "No selection"}</span>
                    </div>
                    <div>
                        <b>AI Decision</b>
                        <span>${valueOrDash(ai?.recommendation)}</span>
                    </div>
                    <div>
                        <b>Risk Approval</b>
                        <span>${valueOrDash(risk?.decision)}</span>
                    </div>
                    <div>
                        <b>Lifecycle</b>
                        <span>${valueOrDash(state?.lifecycle)}</span>
                    </div>
                </div>

                <div class="command-center-grid">
                    <div><b>Portfolio Heat</b><span>${Number(risk?.portfolio_heat_after || portfolio?.portfolio_heat_percent || 0).toFixed(2)}%</span></div>
                    <div><b>Buying Power</b><span>${money(portfolio?.buying_power || state?.execution?.buying_power)}</span></div>
                    <div><b>Open Positions</b><span>${Number(portfolio?.open_positions || 0)}</span></div>
                    <div><b>Open Risk</b><span>${money(portfolio?.open_risk || risk?.proposed_risk)}</span></div>
                    <div><b>Automation</b><span>${Number(state?.automation?.active || 0)} active</span></div>
                    <div><b>AI Confidence</b><span>${Number(ai?.confidence_score || 0).toFixed(0)}%</span></div>
                </div>

                <div class="command-center-recommendation">
                    <b>Command Recommendation</b>
                    <p>${buildRecommendation(state)}</p>
                </div>
            </section>
        `;
    }

    function buildRecommendation(state) {
        if (!state?.selectedOpportunity) return "Select an opportunity to begin the institutional workflow.";
        if (String(state?.riskAssessment?.decision || "").includes("Rejected")) return "Risk engine rejected this trade. Do not execute.";
        if (String(state?.readiness || "").includes("Execution Ready")) return "AI and risk checks agree. Paper execution is permitted.";
        if (String(state?.riskAssessment?.decision || "").includes("Caution")) return "Proceed only with reduced size or additional confirmation.";
        return "Continue reviewing AI decision, risk approval, and portfolio exposure.";
    }

    window.EventBus?.subscribe?.("command-center.updated", renderCommandCenterPanel);
    document.addEventListener("DOMContentLoaded", () => setTimeout(renderCommandCenterPanel, 900));

    window.CommandCenterPanel = {
        renderCommandCenterPanel,
    };
})();
