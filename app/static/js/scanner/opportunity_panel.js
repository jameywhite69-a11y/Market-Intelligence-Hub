async function renderOpportunityPanel(result) {
    scannerDom.opportunityPanel.innerHTML = "";

    if (window.opportunityExplorer) {
        window.opportunityExplorer.renderOpportunityExplorer(result);
    }

    if (window.technicalIntelligence) {
        const enrichment = await window.technicalIntelligence.enrichOpportunity(result);

        if (window.decisionPanel) {
            scannerDom.opportunityPanel.insertAdjacentHTML(
                "beforeend",
                window.decisionPanel.renderDecisionPanel(enrichment.decision)
            );
        }

        if (window.confidencePanel) {
            scannerDom.opportunityPanel.insertAdjacentHTML(
                "beforeend",
                window.confidencePanel.renderConfidencePanel(enrichment.confidence)
            );
        }

        if (window.tradePlanPanel) {
            scannerDom.opportunityPanel.insertAdjacentHTML(
                "beforeend",
                window.tradePlanPanel.renderTradePlanPanel(enrichment.tradePlan)
            );
        }

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
    if (window.uiEmptyStates) {
        scannerDom.opportunityPanel.innerHTML = window.uiEmptyStates.renderDecisionIdleState();
        return;
    }

    scannerDom.opportunityPanel.innerHTML = "";
}

window.opportunityPanel = {
    renderOpportunityPanel,
    clearOpportunityPanel,
};
