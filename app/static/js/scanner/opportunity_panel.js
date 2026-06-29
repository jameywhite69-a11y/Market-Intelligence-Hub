async function renderOpportunityPanel(result) {
    if (window.opportunityExplorer) window.opportunityExplorer.renderOpportunityExplorer(result);
    if (window.technicalIntelligence) {
        const enrichment = await window.technicalIntelligence.enrichOpportunity(result);
        if (window.decisionPanel) scannerDom.opportunityPanel.insertAdjacentHTML("beforeend", window.decisionPanel.renderDecisionPanel(enrichment.decision));
        if (window.confidencePanel) scannerDom.opportunityPanel.insertAdjacentHTML("beforeend", window.confidencePanel.renderConfidencePanel(enrichment.confidence));
        if (window.tradePlanPanel) scannerDom.opportunityPanel.insertAdjacentHTML("beforeend", window.tradePlanPanel.renderTradePlanPanel(enrichment.tradePlan));
        if (window.strategyScorePanel) scannerDom.opportunityPanel.insertAdjacentHTML("beforeend", window.strategyScorePanel.renderStrategyScore(enrichment.strategyScore));
        scannerDom.opportunityPanel.insertAdjacentHTML("beforeend", window.technicalIntelligence.renderTechnicalLevels(enrichment.technical));
    }
}
function clearOpportunityPanel() {
    scannerDom.opportunityPanel.innerHTML = `<h2>Institutional Decision Engine</h2><p class="muted">Select a result to view decision, confidence, trade plan, score, and technical context.</p>`;
}
window.opportunityPanel = { renderOpportunityPanel, clearOpportunityPanel };
