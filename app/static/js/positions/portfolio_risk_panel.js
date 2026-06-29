async function fetchPortfolioRisk() {
    const response = await fetch("/api/positions/portfolio-risk", {
        headers: {"Accept": "application/json"},
    });
    if (!response.ok) throw new Error(`Portfolio risk failed: ${response.status}`);
    return await response.json();
}

function renderPortfolioRisk(payload) {
    const panel = document.getElementById("portfolioRiskPanel");
    if (!panel) return;

    panel.innerHTML = `
        <section class="portfolio-risk-card">
            <div class="terminal-card-header">
                <h3>Portfolio Risk</h3>
                <span>${payload.risk_status}</span>
            </div>

            <div class="portfolio-risk-grid">
                <div><b>Exposure</b><span>$${Number(payload.gross_exposure).toFixed(2)}</span></div>
                <div><b>Exposure %</b><span>${Number(payload.exposure_percent).toFixed(2)}%</span></div>
                <div><b>Open Risk</b><span>$${Number(payload.open_risk).toFixed(2)}</span></div>
                <div><b>Heat</b><span>${Number(payload.portfolio_heat).toFixed(2)}%</span></div>
                <div><b>Open Positions</b><span>${payload.open_positions}</span></div>
                <div><b>Unrealized</b><span>$${Number(payload.unrealized_pnl).toFixed(2)}</span></div>
            </div>
        </section>
    `;
}

async function renderPortfolioRiskPanel() {
    const panel = document.getElementById("portfolioRiskPanel");
    if (!panel) return;

    try {
        renderPortfolioRisk(await fetchPortfolioRisk());
    } catch (error) {
        panel.innerHTML = `<p class="muted">Portfolio risk unavailable: ${error.message}</p>`;
    }
}

document.addEventListener("paper-trade-updated", renderPortfolioRiskPanel);
window.EventBus?.subscribe?.("paper-order-filled", renderPortfolioRiskPanel);
window.EventBus?.subscribe?.("scan:completed", renderPortfolioRiskPanel);

window.PortfolioRiskPanel = {renderPortfolioRiskPanel};
