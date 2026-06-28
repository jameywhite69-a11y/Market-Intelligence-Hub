async function renderOpportunityPanel(result) {
    if (window.opportunityExplorer) {
        window.opportunityExplorer.renderOpportunityExplorer(result);
    }

    if (window.technicalIntelligence) {
        const enrichment = await window.technicalIntelligence.enrichOpportunity(result);

        if (window.strategyScorePanel) {
            scannerDom.opportunityPanel.insertAdjacentHTML(
                "beforeend",
                window.strategyScorePanel.renderStrategyScore(enrichment.strategyScore)
            );
        }

        scannerDom.opportunityPanel.insertAdjacentHTML(
            "beforeend",
            window.technicalIntelligence.renderTechnicalLevels(enrichment.technical)
        );
    }
}

function clearOpportunityPanel() {
    scannerDom.opportunityPanel.innerHTML = `<h2>Opportunity Explorer</h2><p class="muted">Select a result to view score composition, risk assessment, trade plan, technical levels, and strategy scoring.</p>`;
}

window.opportunityPanel = {
    renderOpportunityPanel,
    clearOpportunityPanel,
};
