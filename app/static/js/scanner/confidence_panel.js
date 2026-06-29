function renderConfidencePanel(confidence) {
    if (!confidence) {
        return `
            <div class="confidence-card compact">
                <h3>Institutional Confidence Engine</h3>
                <p class="muted">Confidence analysis unavailable.</p>
            </div>
        `;
    }

    return `
        <details class="inspector-collapse">
            <summary>
                <span>Confidence Engine</span>
                <b>${Number(confidence.confidence_score).toFixed(1)} · ${confidence.confidence_label}</b>
            </summary>

            <div class="confidence-card compact">
                <p class="muted">${confidence.summary}</p>
                <div class="confidence-factors compact-list">
                    ${confidence.factors.map((factor) => `
                        <div class="confidence-factor compact">
                            <div class="factor-head">
                                <b>${factor.name}</b>
                                <span>${Number(factor.score).toFixed(1)}</span>
                            </div>
                            <div class="factor-track">
                                <div class="factor-fill" style="width:${factor.score}%"></div>
                            </div>
                            <small>${factor.status}</small>
                        </div>
                    `).join("")}
                </div>
            </div>
        </details>
    `;
}

window.confidencePanel = {
    renderConfidencePanel,
};
