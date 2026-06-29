function renderDecisionPanel(decision) {
    if (!decision) {
        return `<div class="decision-card"><h3>Institutional Decision Engine</h3><p class="muted">Decision analysis unavailable.</p></div>`;
    }
    return `
        <div class="decision-card">
            <div class="decision-header">
                <div><h3>Institutional Decision</h3><span>${decision.classification}</span></div>
                <div class="decision-score">${Number(decision.decision_score).toFixed(1)}</div>
            </div>
            <div class="decision-summary-grid">
                <div><b>Recommendation</b><span>${decision.recommendation}</span></div>
                <div><b>Priority</b><span>${decision.priority}</span></div>
                <div><b>Expected R</b><span>${Number(decision.expected_r).toFixed(2)}R</span></div>
                <div><b>Bias</b><span>${decision.position_bias.toUpperCase()}</span></div>
            </div>
            <p class="decision-explanation">${decision.explanation}</p>
            <h4>Top Reasons</h4>
            <ul class="decision-list positive">${decision.top_reasons.map((reason) => `<li>✓ ${reason}</li>`).join("")}</ul>
            <h4>Concerns</h4>
            <ul class="decision-list caution">${decision.concerns.map((concern) => `<li>• ${concern}</li>`).join("")}</ul>
            <h4>Decision Factors</h4>
            <div class="decision-factors">
                ${decision.factors.map((factor) => `
                    <div class="decision-factor">
                        <div class="factor-head"><b>${factor.name}</b><span>${Number(factor.contribution).toFixed(2)} / ${factor.weight}</span></div>
                        <div class="factor-track"><div class="factor-fill" style="width:${factor.score}%"></div></div>
                        <small>${factor.status}: ${factor.note}</small>
                    </div>
                `).join("")}
            </div>
        </div>`;
}
window.decisionPanel = { renderDecisionPanel };
