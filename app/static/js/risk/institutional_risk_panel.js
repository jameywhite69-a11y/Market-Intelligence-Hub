async function buildRiskAssessment() {
    const context = window.WorkspaceContext?.snapshot?.() || {};
    const opportunity = context.selectedOpportunity || window.OpportunityStore?.getSelectedOpportunity?.();
    if (!opportunity) return null;
    return await window.institutionalRiskClient.assess({ ...context, selectedOpportunity: opportunity });
}

function riskClass(decision) {
    const value = String(decision || "").toLowerCase();
    if (value.includes("approved")) return "approved";
    if (value.includes("caution")) return "caution";
    return "rejected";
}

function renderInstitutionalRisk(payload) {
    const panel = document.getElementById("institutionalRiskPanel");
    if (!panel) return;

    if (!payload) {
        panel.innerHTML = `
            <section class="institutional-risk-card">
                <div class="terminal-card-header"><h3>Institutional Risk</h3><span>Waiting</span></div>
                <p class="muted">Select an opportunity to run pre-trade risk approval.</p>
            </section>`;
        return;
    }

    panel.innerHTML = `
        <section class="institutional-risk-card ${riskClass(payload.decision)}">
            <div class="terminal-card-header">
                <h3>Institutional Risk</h3>
                <span>${payload.decision}</span>
            </div>

            <div class="risk-hero">
                <div><b>${payload.symbol}</b><span>${payload.timeframe}</span></div>
                <strong>${payload.decision}</strong>
            </div>

            <div class="risk-metric-grid">
                <div><b>Heat Before</b><span>${Number(payload.portfolio_heat_before).toFixed(2)}%</span></div>
                <div><b>Heat After</b><span>${Number(payload.portfolio_heat_after).toFixed(2)}%</span></div>
                <div><b>Risk Budget</b><span>$${Number(payload.daily_risk_budget).toFixed(2)}</span></div>
                <div><b>Remaining</b><span>$${Number(payload.daily_risk_remaining).toFixed(2)}</span></div>
                <div><b>Proposed Risk</b><span>$${Number(payload.proposed_risk).toFixed(2)}</span></div>
                <div><b>Recommended Qty</b><span>${Number(payload.recommended_quantity).toFixed(4)}</span></div>
            </div>

            <div class="risk-check-list">
                ${(payload.checks || []).map(check => `
                    <div class="risk-check-row ${String(check.status).toLowerCase()}">
                        <div>
                            <b>${check.name}</b>
                            <span>${check.message}</span>
                        </div>
                        <strong>${check.status}</strong>
                    </div>
                `).join("")}
            </div>

            ${(payload.warnings || []).map(item => `<p class="risk-warning">${item}</p>`).join("")}
            ${(payload.rejection_reasons || []).map(item => `<p class="risk-rejection">${item}</p>`).join("")}
        </section>`;
}

async function renderInstitutionalRiskPanel() {
    const panel = document.getElementById("institutionalRiskPanel");
    if (!panel) return;

    try {
        const assessment = await buildRiskAssessment();
        window.WorkspaceStore?.set?.("institutionalRiskAssessment", assessment);
        window.EventBus?.publish?.("risk.assessed", assessment || {});
        renderInstitutionalRisk(assessment);
    } catch (error) {
        panel.innerHTML = `<p class="muted">Institutional Risk unavailable: ${error.message}</p>`;
        window.WorkspaceStore?.pushError?.(error, "institutional-risk");
    }
}

window.EventBus?.subscribe?.("workspace.context.changed", renderInstitutionalRiskPanel);
window.EventBus?.subscribe?.("opportunity:selected", renderInstitutionalRiskPanel);
window.EventBus?.subscribe?.("paper-order-filled", renderInstitutionalRiskPanel);
document.addEventListener("paper-trade-updated", renderInstitutionalRiskPanel);
document.addEventListener("DOMContentLoaded", () => setTimeout(renderInstitutionalRiskPanel, 350));

window.InstitutionalRiskPanel = { renderInstitutionalRiskPanel };
