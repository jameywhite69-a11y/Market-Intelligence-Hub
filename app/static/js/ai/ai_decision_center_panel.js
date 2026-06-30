async function buildAIDecision() {
    const context = window.WorkspaceContext?.snapshot?.() || {};
    const opportunity = context.selectedOpportunity || window.OpportunityStore?.getSelectedOpportunity?.();
    if (!opportunity) return null;
    return await window.aiDecisionClient.analyze({ ...context, selectedOpportunity: opportunity });
}

function renderAIDecision(payload) {
    const panel = document.getElementById("aiDecisionCenterPanel");
    if (!panel) return;

    if (!payload) {
        panel.innerHTML = `<section class="ai-decision-card"><div class="terminal-card-header"><h3>AI Decision Center</h3><span>Waiting</span></div><p class="muted">Select an opportunity to generate institutional decision commentary.</p></section>`;
        return;
    }

    panel.innerHTML = `
        <section class="ai-decision-card">
            <div class="terminal-card-header"><h3>AI Decision Center</h3><span>${payload.recommendation}</span></div>
            <div class="ai-decision-hero"><div><b>${payload.symbol}</b><span>${payload.timeframe} · ${payload.confidence_label}</span></div><strong>${Number(payload.confidence_score).toFixed(0)}%</strong></div>
            <p class="ai-decision-summary">${payload.summary}</p>
            <div class="ai-factor-list">${(payload.factors || []).map(factor => `<div class="ai-factor-row"><div><b>${factor.name}</b><span>${factor.status}</span></div><strong>${Number(factor.score).toFixed(0)}</strong><small>${factor.explanation}</small></div>`).join("")}</div>
            <div class="ai-case-grid">
                <div><h4>Bullish Case</h4>${(payload.bullish_case || []).map(item => `<p>${item}</p>`).join("") || `<p class="muted">No major bullish edge detected.</p>`}</div>
                <div><h4>Bearish Case</h4>${(payload.bearish_case || []).map(item => `<p>${item}</p>`).join("") || `<p class="muted">No major bearish concern detected.</p>`}</div>
            </div>
            <div class="ai-action-plan"><h4>Action Plan</h4>${(payload.action_plan || []).map(item => `<p>${item}</p>`).join("")}</div>
        </section>`;
}

async function renderAIDecisionCenterPanel() {
    const panel = document.getElementById("aiDecisionCenterPanel");
    if (!panel) return;
    try { renderAIDecision(await buildAIDecision()); }
    catch (error) { panel.innerHTML = `<p class="muted">AI Decision Center unavailable: ${error.message}</p>`; }
}

window.EventBus?.subscribe?.("workspace.context.changed", renderAIDecisionCenterPanel);
window.EventBus?.subscribe?.("opportunity:selected", renderAIDecisionCenterPanel);
window.EventBus?.subscribe?.("scan:completed", renderAIDecisionCenterPanel);
document.addEventListener("DOMContentLoaded", () => setTimeout(renderAIDecisionCenterPanel, 300));
window.AIDecisionCenterPanel = { renderAIDecisionCenterPanel };
