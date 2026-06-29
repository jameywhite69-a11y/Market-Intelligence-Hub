function renderStrategyScore(strategyScore) {
    if (!strategyScore) {
        return `
            <details class="inspector-collapse">
                <summary><span>Strategy Score</span><b>Unavailable</b></summary>
                <div class="strategy-score-card compact"><p class="muted">Strategy score unavailable.</p></div>
            </details>
        `;
    }

    return `
        <details class="inspector-collapse">
            <summary>
                <span>Strategy Score</span>
                <b>${Number(strategyScore.overall_score).toFixed(1)} · ${strategyScore.grade}</b>
            </summary>

            <div class="strategy-score-card compact">
                <div class="score-components compact-list">
                    ${strategyScore.components.map((component) => `
                        <div class="score-component compact">
                            <div class="component-head">
                                <b>${component.name}</b>
                                <span>${Number(component.contribution).toFixed(2)} / ${component.weight}</span>
                            </div>
                            <div class="component-track">
                                <div class="component-fill" style="width:${component.score}%"></div>
                            </div>
                            <small>${component.status}</small>
                        </div>
                    `).join("")}
                </div>
            </div>
        </details>
    `;
}

window.strategyScorePanel = {
    renderStrategyScore,
};
