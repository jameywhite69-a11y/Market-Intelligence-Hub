function renderQuietEmptyState(title = "Ready", subtitle = "") {
    return `
        <div class="quiet-empty-state">
            <div class="quiet-empty-icon">◆</div>
            <div>
                <b>${title}</b>
                ${subtitle ? `<span>${subtitle}</span>` : ""}
            </div>
        </div>
    `;
}

function renderDecisionIdleState() {
    return `
        <div class="decision-idle-card">
            <div class="decision-idle-mark">MIH</div>
            <h3>Institutional Decision Engine</h3>
            <div class="idle-metric-row">
                <div><b>Decision</b><span>Waiting</span></div>
                <div><b>Confidence</b><span>—</span></div>
                <div><b>Expected R</b><span>—</span></div>
                <div><b>Allocation</b><span>—</span></div>
            </div>
        </div>
    `;
}

window.uiEmptyStates = {
    renderQuietEmptyState,
    renderDecisionIdleState,
};
