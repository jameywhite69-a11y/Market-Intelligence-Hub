function renderPortfolioIntelligencePanel(portfolio) {
    if (!portfolio) {
        return `
            <details class="inspector-collapse">
                <summary><span>Portfolio Intelligence</span><b>Unavailable</b></summary>
                <div class="portfolio-intelligence-card compact"><p class="muted">Portfolio intelligence unavailable.</p></div>
            </details>
        `;
    }

    return `
        <details class="inspector-collapse" open>
            <summary>
                <span>Portfolio Intelligence</span>
                <b>${portfolio.portfolio_action} · ${Number(portfolio.portfolio_fit_score).toFixed(1)}</b>
            </summary>

            <div class="portfolio-intelligence-card compact">
                <div class="portfolio-intel-header">
                    <div>
                        <h3>${portfolio.portfolio_action}</h3>
                        <span>${portfolio.recommended_position_size}</span>
                    </div>
                    <div class="portfolio-fit-score">${Number(portfolio.portfolio_fit_score).toFixed(1)}</div>
                </div>

                <p class="portfolio-intel-narrative">${portfolio.narrative}</p>

                <div class="portfolio-intel-grid">
                    <div><b>Heat</b><span>${Number(portfolio.portfolio_heat).toFixed(1)}%</span></div>
                    <div><b>Risk Budget</b><span>${Number(portfolio.risk_budget_remaining).toFixed(1)}%</span></div>
                    <div><b>Correlation</b><span>${portfolio.correlation_risk}</span></div>
                    <div><b>Exposure</b><span>${portfolio.exposure_risk}</span></div>
                </div>

                <details class="mini-collapse">
                    <summary>Exposure</summary>
                    <div class="portfolio-exposure-list">
                        ${portfolio.exposures.map(exposure => `
                            <div>
                                <b>${exposure.asset_class}</b>
                                <span>${Number(exposure.exposure_percent).toFixed(1)}%</span>
                                <small>${exposure.note}</small>
                            </div>
                        `).join("")}
                    </div>
                </details>

                <details class="mini-collapse">
                    <summary>Warnings</summary>
                    <ul>${portfolio.warnings.map(warning => `<li>${warning}</li>`).join("")}</ul>
                </details>
            </div>
        </details>
    `;
}

window.portfolioIntelligencePanel = {
    renderPortfolioIntelligencePanel,
};
