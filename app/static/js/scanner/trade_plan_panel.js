function renderTradePlanPanel(tradePlan) {
    if (!tradePlan) {
        return `
            <details class="inspector-collapse">
                <summary><span>Trade Planning Engine</span><b>Unavailable</b></summary>
                <div class="trade-plan-engine-card compact">
                    <p class="muted">Trade plan unavailable.</p>
                </div>
            </details>
        `;
    }

    return `
        <details class="inspector-collapse" open>
            <summary>
                <span>Trade Planning Engine</span>
                <b>${tradePlan.action} · ${Number(tradePlan.expected_r_multiple).toFixed(2)}R</b>
            </summary>

            <div class="trade-plan-engine-card compact">
                <div class="trade-plan-grid compact-grid">
                    <div><b>Entry</b><span>${tradePlan.entry_price}</span></div>
                    <div><b>Stop</b><span>${tradePlan.stop_loss}</span></div>
                    <div><b>Target 1</b><span>${tradePlan.target_1}</span></div>
                    <div><b>Target 2</b><span>${tradePlan.target_2}</span></div>
                    <div><b>Position</b><span>${tradePlan.position_size}</span></div>
                    <div><b>Risk</b><span>$${Number(tradePlan.dollar_risk).toFixed(2)}</span></div>
                    <div><b>Notional</b><span>$${Number(tradePlan.notional_value).toFixed(2)}</span></div>
                    <div><b>R:R 2</b><span>${tradePlan.risk_reward_2}</span></div>
                </div>
            </div>
        </details>
    `;
}

window.tradePlanPanel = {
    renderTradePlanPanel,
};
