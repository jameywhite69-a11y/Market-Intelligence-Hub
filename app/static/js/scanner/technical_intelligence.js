const technicalClient = new window.TechnicalApiClient();

async function enrichOpportunity(result) {
    try {
        const payload = await technicalClient.analyze(result.symbol, result.timeframe);
        return payload.technical || null;
    } catch (error) {
        console.warn("Technical intelligence unavailable", error);
        return null;
    }
}

function renderTechnicalLevels(technical) {
    if (!technical) {
        return `<div class="technical-card"><h3>Technical Engine</h3><p class="muted">Technical levels unavailable.</p></div>`;
    }

    return `
        <div class="technical-card">
            <h3>Institutional Technical Engine</h3>
            <div class="technical-grid">
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
    `;
}

window.technicalIntelligence = {
    enrichOpportunity,
    renderTechnicalLevels,
};
