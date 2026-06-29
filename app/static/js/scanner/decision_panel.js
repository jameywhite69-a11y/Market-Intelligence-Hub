function factorClass(score) {
    const value = Number(score || 0);
    if (value >= 80) return "strong";
    if (value >= 60) return "medium";
    return "weak";
}

function renderDecisionPanel(decision) {
    if (!decision) {
        return `
            <div class="decision-card compact">
                <h3>Institutional Decision Engine</h3>
                <p class="muted">Decision analysis unavailable.</p>
            </div>
        `;
    }

    const factors = decision.factors || [];
    const topFactors = factors.slice(0, 3);
    const remainingFactors = factors.slice(3);

    return `
        <div class="decision-card compact">
            <div class="decision-sticky-summary">
                <div>
                    <h3>Institutional Decision</h3>
                    <span class="decision-classification">${decision.classification}</span>
                </div>
                <div class="decision-score">${Number(decision.decision_score).toFixed(1)}</div>
            </div>

            <div class="decision-chip-row">
                <span>${decision.recommendation}</span>
                <span>${decision.priority}</span>
                <span>${Number(decision.expected_r).toFixed(2)}R</span>
                <span>${decision.position_bias.toUpperCase()}</span>
            </div>

            <details class="decision-section" open>
                <summary>Decision Summary</summary>
                <p class="decision-explanation">${decision.explanation}</p>
            </details>

            <details class="decision-section" open>
                <summary>Top Reasons</summary>
                <ul class="decision-list positive">
                    ${decision.top_reasons.map((reason) => `<li>✓ ${reason}</li>`).join("")}
                </ul>
            </details>

            <details class="decision-section">
                <summary>Concerns</summary>
                <ul class="decision-list caution">
                    ${decision.concerns.map((concern) => `<li>• ${concern}</li>`).join("")}
                </ul>
            </details>

            <details class="decision-section" open>
                <summary>Primary Factors</summary>
                <div class="decision-factor-grid">
                    ${topFactors.map((factor) => renderDecisionFactor(factor)).join("")}
                </div>
            </details>

            <details class="decision-section">
                <summary>All Decision Factors</summary>
                <div class="decision-factor-grid">
                    ${remainingFactors.map((factor) => renderDecisionFactor(factor)).join("")}
                </div>
            </details>
        </div>
    `;
}

function renderDecisionFactor(factor) {
    const score = Number(factor.score || 0);

    return `
        <div class="decision-factor compact ${factorClass(score)}">
            <div class="factor-head">
                <b>${factor.name}</b>
                <span>${Number(factor.contribution).toFixed(2)} / ${factor.weight}</span>
            </div>
            <div class="factor-track">
                <div class="factor-fill" style="width:${score}%"></div>
            </div>
            <small>${factor.status}</small>
        </div>
    `;
}

window.decisionPanel = {
    renderDecisionPanel,
};
