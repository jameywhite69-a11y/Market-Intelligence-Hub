async function renderOpportunityPanel(result) {
    if (window.opportunityExplorer) {
        window.opportunityExplorer.renderOpportunityExplorer(result);
    }

    if (window.technicalIntelligence) {
        const technical = await window.technicalIntelligence.enrichOpportunity(result);
        const card = window.technicalIntelligence.renderTechnicalLevels(technical);
        scannerDom.opportunityPanel.insertAdjacentHTML("beforeend", card);
    }
}

function clearOpportunityPanel() {
    scannerDom.opportunityPanel.innerHTML = `<h2>Opportunity Explorer</h2><p class="muted">Select a result to view score composition, risk assessment, trade plan, technical levels, and multi-timeframe context.</p>`;
}

window.opportunityPanel = {
    renderOpportunityPanel,
    clearOpportunityPanel,
};
