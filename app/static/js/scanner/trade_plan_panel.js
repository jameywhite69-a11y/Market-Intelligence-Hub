function renderTradePlanPanel(tradePlan) {
    if (!tradePlan) {
        return `
            <div class="trade-plan-engine-card">
                <h3>Trade Planning Engine</h3>
                <p class="muted">Trade plan unavailable.</p>
            </div>
        `;
    }

    return `
        <div class="trade-plan-engine-card">
            <div class="trade-plan-header">
                <div>
                    <h3>Trade Planning Engine</h3>
                    <span>${tradePlan.action} · ${tradePlan.direction.toUpperCase()}</span>
                </div>
                <div class="expected-r">
                    ${Number(tradePlan.expected_r_multiple).toFixed(2)}R
                </div>
            </div>

            <div class="trade-plan-grid">
                <div><b>Entry</b><span>${tradePlan.entry_price}</span></div>
                <div><b>Stop</b><span>${tradePlan.stop_loss}</span></div>
                <div><b>Target 1</b><span>${tradePlan.target_1}</span></div>
                <div><b>Target 2</b><span>${tradePlan.target_2}</span></div>
                <div><b>Trailing Stop</b><span>${tradePlan.trailing_stop}</span></div>
                <div><b>Risk / Share</b><span>${tradePlan.risk_per_share}</span></div>
                <div><b>Position Size</b><span>${tradePlan.position_size}</span></div>
                <div><b>Dollar Risk</b><span>$${Number(tradePlan.dollar_risk).toFixed(2)}</span></div>
                <div><b>Notional</b><span>$${Number(tradePlan.notional_value).toFixed(2)}</span></div>
                <div><b>R:R 1</b><span>${tradePlan.risk_reward_1}</span></div>
                <div><b>R:R 2</b><span>${tradePlan.risk_reward_2}</span></div>
                <div><b>Risk %</b><span>${tradePlan.risk_percent}%</span></div>
            </div>

            <div class="trade-plan-notes">
                ${tradePlan.notes.map((note) => `<p>${note}</p>`).join("")}
            </div>
        </div>
    `;
}

window.tradePlanPanel = {
    renderTradePlanPanel,
};