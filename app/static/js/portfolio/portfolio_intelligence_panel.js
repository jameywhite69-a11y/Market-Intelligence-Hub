async function loadPortfolioIntelligenceSnapshot() {
    const snapshot = await window.portfolioIntelligenceClient.snapshot();
    window.WorkspaceStore?.set?.("portfolioIntelligenceSnapshot", snapshot);
    window.EventBus?.publish?.("portfolio-intelligence.updated", snapshot);
    return snapshot;
}

function renderPortfolioIntelligencePanel(snapshot = window.WorkspaceStore?.get?.("portfolioIntelligenceSnapshot")) {
    const panel = document.getElementById("portfolioIntelligencePanel");
    if (!panel) return;

    if (!snapshot) {
        panel.innerHTML = `
            <section class="portfolio-intelligence-card">
                <div class="terminal-card-header">
                    <h3>Portfolio Intelligence</h3>
                    <span>Loading</span>
                </div>
                <p class="muted">Portfolio intelligence will appear after the execution snapshot loads.</p>
            </section>
        `;
        return;
    }

    panel.innerHTML = `
        <section class="portfolio-intelligence-card">
            <div class="terminal-card-header">
                <h3>Portfolio Intelligence</h3>
                <span>${snapshot.open_positions} open</span>
            </div>

            <div class="portfolio-metric-grid">
                <div><b>Equity</b><span>$${Number(snapshot.equity).toFixed(2)}</span></div>
                <div><b>Buying Power</b><span>$${Number(snapshot.buying_power).toFixed(2)}</span></div>
                <div><b>Open P/L</b><span>$${Number(snapshot.open_pnl).toFixed(2)}</span></div>
                <div><b>Realized</b><span>$${Number(snapshot.realized_pnl).toFixed(2)}</span></div>
                <div><b>Open Risk</b><span>$${Number(snapshot.open_risk).toFixed(2)}</span></div>
                <div><b>Heat</b><span>${Number(snapshot.portfolio_heat_percent).toFixed(2)}%</span></div>
            </div>

            <div class="daily-risk-bar">
                <div class="daily-risk-fill" style="width:${Math.min(100, Number(snapshot.daily_risk_used) / Math.max(1, Number(snapshot.daily_risk_budget)) * 100)}%"></div>
            </div>
            <small class="muted">Daily risk used: $${Number(snapshot.daily_risk_used).toFixed(2)} / $${Number(snapshot.daily_risk_budget).toFixed(2)}</small>

            <div class="exposure-list">
                ${(snapshot.exposure || []).map(item => `
                    <div class="exposure-row">
                        <b>${item.name}</b>
                        <span>${Number(item.percent).toFixed(1)}%</span>
                        <div class="exposure-track"><div style="width:${Math.min(100, Number(item.percent))}%"></div></div>
                    </div>
                `).join("")}
            </div>

            <div class="portfolio-recommendation">
                <b>Recommendation</b>
                <p>${snapshot.recommendation}</p>
                ${(snapshot.warnings || []).map(warning => `<p class="warning">${warning}</p>`).join("")}
            </div>
        </section>
    `;
}

async function refreshPortfolioIntelligencePanel() {
    const panel = document.getElementById("portfolioIntelligencePanel");
    if (!panel) return;

    try {
        renderPortfolioIntelligencePanel(await loadPortfolioIntelligenceSnapshot());
    } catch (error) {
        panel.innerHTML = `<p class="muted">Portfolio Intelligence unavailable: ${error.message}</p>`;
        window.WorkspaceStore?.pushError?.(error, "portfolio-intelligence");
    }
}

window.EventBus?.subscribe?.("paper-order-filled", refreshPortfolioIntelligencePanel);
window.EventBus?.subscribe?.("paper-order-rejected", refreshPortfolioIntelligencePanel);
window.EventBus?.subscribe?.("portfolio-intelligence.updated", renderPortfolioIntelligencePanel);
document.addEventListener("paper-trade-updated", refreshPortfolioIntelligencePanel);
document.addEventListener("DOMContentLoaded", () => setTimeout(refreshPortfolioIntelligencePanel, 350));

window.PortfolioIntelligencePanelV42 = {
    refreshPortfolioIntelligencePanel,
    renderPortfolioIntelligencePanel,
};
