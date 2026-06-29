function renderOpportunityIntelligencePanel(report) {
    if (!report) {
        return `
            <details class="inspector-collapse">
                <summary><span>Opportunity Intelligence</span><b>Unavailable</b></summary>
                <div class="opportunity-intelligence-card compact">
                    <p class="muted">Opportunity intelligence unavailable.</p>
                </div>
            </details>
        `;
    }

    return `
        <details class="inspector-collapse" open>
            <summary>
                <span>Opportunity Intelligence</span>
                <b>${report.analyst_rating} · ${Number(report.institutional_score).toFixed(1)}</b>
            </summary>

            <div class="opportunity-intelligence-card compact">
                <div class="intel-header">
                    <div>
                        <h3>${report.symbol} ${report.timeframe}</h3>
                        <span>${report.setup_quality} · ${report.preferred_strategy}</span>
                    </div>
                    <div class="intel-score">${Number(report.institutional_score).toFixed(1)}</div>
                </div>

                <p class="intel-summary">${report.narrative.summary}</p>

                <div class="intel-grid">
                    <div><b>Direction</b><span>${report.trade_direction.toUpperCase()}</span></div>
                    <div><b>Risk</b><span>${report.risk.risk_level}</span></div>
                    <div><b>Rating</b><span>${report.analyst_rating}</span></div>
                    <div><b>Strategy</b><span>${report.preferred_strategy}</span></div>
                </div>

                <details class="mini-collapse" open>
                    <summary>Execution Levels</summary>
                    <div class="intel-level-list">
                        ${[...report.entry_zone, ...report.exit_plan].map(level => `
                            <div>
                                <b>${level.label}</b>
                                <span>${Number(level.value).toFixed(4)}</span>
                                <small>${level.note}</small>
                            </div>
                        `).join("")}
                    </div>
                </details>

                <details class="mini-collapse">
                    <summary>Analyst Narrative</summary>
                    <h4>Bullish Case</h4>
                    <ul>${report.narrative.bullish_case.map(item => `<li>${item}</li>`).join("")}</ul>
                    <h4>Risk / Bearish Case</h4>
                    <ul>${report.narrative.bearish_case.map(item => `<li>${item}</li>`).join("")}</ul>
                    <p>${report.narrative.trade_plan_summary}</p>
                </details>

                <details class="mini-collapse">
                    <summary>Action Items</summary>
                    <ul>${report.action_items.map(item => `<li>${item}</li>`).join("")}</ul>
                </details>
            </div>
        </details>
    `;
}

window.opportunityIntelligencePanel = {
    renderOpportunityIntelligencePanel,
};
