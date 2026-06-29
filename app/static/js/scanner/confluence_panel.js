function renderConfluencePanel(confluence) {
    if (!confluence) {
        return `
            <details class="inspector-collapse">
                <summary><span>Multi-Timeframe Confluence</span><b>Unavailable</b></summary>
                <div class="confluence-card compact"><p class="muted">Confluence unavailable.</p></div>
            </details>
        `;
    }

    return `
        <details class="inspector-collapse" open>
            <summary>
                <span>Multi-Timeframe Confluence</span>
                <b>${Number(confluence.confluence_score).toFixed(1)} · ${confluence.alignment_rating}</b>
            </summary>

            <div class="confluence-card compact">
                <div class="confluence-header">
                    <div>
                        <h3>${confluence.alignment_label}</h3>
                        <span>${confluence.dominant_direction.toUpperCase()} · ${confluence.primary_timeframe}</span>
                    </div>
                    <div class="confluence-score">${Number(confluence.confluence_score).toFixed(1)}</div>
                </div>

                <p class="confluence-narrative">${confluence.narrative}</p>

                <div class="confluence-adjustment">
                    <div><b>Confidence Adj.</b><span>${Number(confluence.confidence_adjustment).toFixed(1)}</span></div>
                    <div><b>Projected Confidence</b><span>${Number(confluence.final_confidence_projection).toFixed(1)}</span></div>
                    <div><b>Conflict</b><span>${confluence.conflict_detected ? "Yes" : "No"}</span></div>
                    <div><b>Counter-Trend</b><span>${confluence.counter_trend ? "Yes" : "No"}</span></div>
                </div>

                <div class="confluence-timeframes">
                    ${confluence.timeframes.map(row => `
                        <div class="confluence-row ${row.status.toLowerCase()}">
                            <b>${row.timeframe}</b>
                            <span>${directionIcon(row.trend_direction)} ${row.trend_direction}</span>
                            <em>${Number(row.score).toFixed(1)}</em>
                            <small>${row.status}</small>
                        </div>
                    `).join("")}
                </div>
            </div>
        </details>
    `;
}

function directionIcon(direction) {
    if (direction === "bullish") return "▲";
    if (direction === "bearish") return "▼";
    return "■";
}

window.confluencePanel = {
    renderConfluencePanel,
};
