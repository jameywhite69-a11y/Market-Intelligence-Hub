const technicalClient = new window.TechnicalApiClient();

async function enrichOpportunity(result) {
    try {
        const payload = await technicalClient.analyze(result.symbol, result.timeframe);
        return {
            technical: payload.technical || null,
            strategyScore: payload.strategy_score || null,
            tradePlan: payload.trade_plan || null,
            confidence: payload.confidence || null,
            decision: payload.decision || null,
            opportunityIntelligence: payload.opportunity_intelligence || null,
        };
    } catch (error) {
        console.warn("Technical intelligence unavailable", error);
        return {
            technical: null,
            strategyScore: null,
            tradePlan: null,
            confidence: null,
            decision: null,
            opportunityIntelligence: null,
        };
    }
}

function renderTechnicalLevels(technical) {
    if (!technical) {
        return `
            <details class="inspector-collapse">
                <summary><span>Technical Engine</span><b>Unavailable</b></summary>
                <div class="technical-card compact"><p class="muted">Technical levels unavailable.</p></div>
            </details>
        `;
    }

    return `
        <details class="inspector-collapse">
            <summary>
                <span>Technical Engine</span>
                <b>${technical.trend_direction} · ATR ${technical.atr}</b>
            </summary>

            <div class="technical-card compact">
                <div class="technical-grid compact-grid">
                    <div><b>Current</b><span>${technical.current_price}</span></div>
                    <div><b>ATR</b><span>${technical.atr}</span></div>
                    <div><b>VWAP</b><span>${technical.vwap}</span></div>
                    <div><b>EMA Fast</b><span>${technical.ema_fast}</span></div>
                    <div><b>EMA Slow</b><span>${technical.ema_slow}</span></div>
                    <div><b>Trend</b><span>${technical.trend_direction}</span></div>
                    <div><b>Entry Low</b><span>${technical.entry_zone_low}</span></div>
                    <div><b>Entry High</b><span>${technical.entry_zone_high}</span></div>
                    <div><b>Stop</b><span>${technical.stop_loss}</span></div>
                    <div><b>Target 1</b><span>${technical.target_1}</span></div>
                    <div><b>Target 2</b><span>${technical.target_2}</span></div>
                    <div><b>R:R 2</b><span>${technical.risk_reward_2}</span></div>
                </div>
            </div>
        </details>
    `;
}

window.technicalIntelligence = {
    enrichOpportunity,
    renderTechnicalLevels,
};
