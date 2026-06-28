function renderStrategyScore(strategyScore) {
    if (!strategyScore) {
        return `<div class="strategy-score-card"><h3>Strategy Score</h3><p class="muted">Strategy score unavailable.</p></div>`;
    }

    return `
        <div class="strategy-score-card">
            <div class="score-header">
                <div>
                    <h3>Institutional Strategy Score</h3>
                    <span>${strategyScore.recommendation}</span>
                </div>
                <div class="score-bubble">${Number(strategyScore.overall_score).toFixed(1)}</div>
            </div>

            <div class="score-badges">
                <span class="badge badge-grade">${strategyScore.grade}</span>
                <span class="badge badge-confidence">${strategyScore.confidence}</span>
            </div>

            <div class="score-components">
                ${strategyScore.components.map((component) => `
                    <div class="score-component">
                        <div class="component-head">
                            <b>${component.name}</b>
                            <span>${component.contribution.toFixed(2)} / ${component.weight}</span>
                        </div>
                        <div class="component-track">
                            <div class="component-fill" style="width:${component.score}%"></div>
                        </div>
                        <div class="component-note">
                            <span>${component.status}</span>
                            <small>${component.note}</small>
                        </div>
                    </div>
                `).join("")}
            </div>
        </div>
    `;
}

window.strategyScorePanel = {
    renderStrategyScore,
};
