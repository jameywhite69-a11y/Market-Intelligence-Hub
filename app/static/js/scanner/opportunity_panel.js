function renderOpportunityPanel(result) {
    if (window.opportunityExplorer) {
        window.opportunityExplorer.renderOpportunityExplorer(result);
        return;
    }

    const score = Number(result.score ?? 0);
    scannerDom.opportunityPanel.innerHTML = `
        <h2>${result.symbol}</h2>
        <div class="inspector-subtitle">${result.timeframe}</div>
        <div class="inspector-score ${scannerUtils.scoreClass(score)}">${score.toFixed(1)}</div>
    `;
}

function clearOpportunityPanel() {
    scannerDom.opportunityPanel.innerHTML = `<h2>Opportunity Explorer</h2><p class="muted">Select a result to view score composition, risk assessment, trade plan, and multi-timeframe context.</p>`;
}

window.opportunityPanel = { renderOpportunityPanel, clearOpportunityPanel };
