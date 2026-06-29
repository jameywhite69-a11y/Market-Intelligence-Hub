function renderStrategyMatrixPanel(matrix) {
    if (!matrix) {
        return `
            <details class="inspector-collapse">
                <summary><span>Institutional Strategy Matrix</span><b>Unavailable</b></summary>
                <div class="strategy-matrix-card compact"><p class="muted">Strategy matrix unavailable.</p></div>
            </details>
        `;
    }

    return `
        <details class="inspector-collapse" open>
            <summary>
                <span>Institutional Strategy Matrix</span>
                <b>${matrix.primary_strategy} · ${Number(matrix.best_score).toFixed(1)}</b>
            </summary>

            <div class="strategy-matrix-card compact">
                <div class="strategy-matrix-header">
                    <div>
                        <h3>${matrix.primary_strategy}</h3>
                        <span>${matrix.strategy_agreement} · ${matrix.strategy_confidence}</span>
                    </div>
                    <div class="strategy-matrix-score">${Number(matrix.best_score).toFixed(1)}</div>
                </div>

                <p class="strategy-matrix-narrative">${matrix.narrative}</p>

                <div class="strategy-matrix-summary">
                    <div><b>Primary</b><span>${matrix.primary_strategy}</span></div>
                    <div><b>Secondary</b><span>${matrix.secondary_strategy || "—"}</span></div>
                    <div><b>Avoid</b><span>${matrix.avoid_strategy || "—"}</span></div>
                    <div><b>Average</b><span>${Number(matrix.average_score).toFixed(1)}</span></div>
                </div>

                <div class="strategy-candidate-list">
                    ${matrix.candidates.map(candidate => `
                        <div class="strategy-candidate ${candidate.classification.toLowerCase().replaceAll(" ", "-")}">
                            <div class="candidate-head">
                                <b>${candidate.name}</b>
                                <span>${Number(candidate.score).toFixed(1)}</span>
                            </div>
                            <div class="candidate-track">
                                <div class="candidate-fill" style="width:${candidate.score}%"></div>
                            </div>
                            <small>${candidate.classification} · ${candidate.confidence}</small>
                        </div>
                    `).join("")}
                </div>
            </div>
        </details>
    `;
}

window.strategyMatrixPanel = {
    renderStrategyMatrixPanel,
};
