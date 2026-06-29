async function renderOpportunityPanel(result) {
    const panel = scannerDom.opportunityPanel || document.getElementById("opportunityPanel");
    if (!panel) return;

    panel.innerHTML = "";

    if (window.opportunityExplorer) {
        window.opportunityExplorer.renderOpportunityExplorer(result);
    }

    if (window.technicalIntelligence) {
        const enrichment = await window.technicalIntelligence.enrichOpportunity(result);

        if (window.opportunityIntelligencePanel) {
            panel.insertAdjacentHTML(
                "beforeend",
                window.opportunityIntelligencePanel.renderOpportunityIntelligencePanel(enrichment.opportunityIntelligence)
            );
        }

        if (window.lifecyclePanel) {
            panel.insertAdjacentHTML(
                "beforeend",
                window.lifecyclePanel.renderLifecyclePanel(enrichment.opportunityLifecycle)
            );
        }

        if (window.portfolioIntelligencePanel) {
            panel.insertAdjacentHTML(
                "beforeend",
                window.portfolioIntelligencePanel.renderPortfolioIntelligencePanel(enrichment.portfolioIntelligence)
            );
        }

        if (window.strategyMatrixPanel) {
            panel.insertAdjacentHTML(
                "beforeend",
                window.strategyMatrixPanel.renderStrategyMatrixPanel(enrichment.strategyMatrix)
            );
        }

        if (window.confluencePanel) {
            panel.insertAdjacentHTML(
                "beforeend",
                window.confluencePanel.renderConfluencePanel(enrichment.confluence)
            );
        }

        if (window.decisionPanel) {
            panel.insertAdjacentHTML(
                "beforeend",
                window.decisionPanel.renderDecisionPanel(enrichment.decision)
            );
        }

        if (window.confidencePanel) {
            panel.insertAdjacentHTML(
                "beforeend",
                window.confidencePanel.renderConfidencePanel(enrichment.confidence)
            );
        }

        if (window.tradePlanPanel) {
            panel.insertAdjacentHTML(
                "beforeend",
                window.tradePlanPanel.renderTradePlanPanel(enrichment.tradePlan)
            );
        }

        if (window.strategyScorePanel) {
            panel.insertAdjacentHTML(
                "beforeend",
                window.strategyScorePanel.renderStrategyScore(enrichment.strategyScore)
            );
        }

        panel.insertAdjacentHTML(
            "beforeend",
            window.technicalIntelligence.renderTechnicalLevels(enrichment.technical)
        );
    }
}

function clearOpportunityPanel() {
    const panel = scannerDom.opportunityPanel || document.getElementById("opportunityPanel");
    if (!panel) return;

    if (window.uiEmptyStates) {
        panel.innerHTML = window.uiEmptyStates.renderDecisionIdleState();
        return;
    }

    panel.innerHTML = "";
}

window.opportunityPanel = {
    renderOpportunityPanel,
    clearOpportunityPanel,
};
