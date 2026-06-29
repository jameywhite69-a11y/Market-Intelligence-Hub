function renderLifecyclePanel(lifecycle) {
    if (!lifecycle) {
        return `
            <details class="inspector-collapse">
                <summary><span>Opportunity Lifecycle</span><b>Unavailable</b></summary>
                <div class="lifecycle-card compact"><p class="muted">Lifecycle unavailable.</p></div>
            </details>
        `;
    }

    return `
        <details class="inspector-collapse" open>
            <summary>
                <span>Opportunity Lifecycle</span>
                <b>${lifecycle.lifecycle_stage} · ${lifecycle.momentum_state}</b>
            </summary>

            <div class="lifecycle-card compact">
                <div class="lifecycle-header">
                    <div>
                        <h3>${lifecycle.lifecycle_stage}</h3>
                        <span>${lifecycle.trigger_state} · ${lifecycle.scans_seen} scans</span>
                    </div>
                    <div class="lifecycle-momentum ${lifecycle.momentum_state.toLowerCase()}">
                        ${momentumSymbol(lifecycle.momentum_state)}
                    </div>
                </div>

                <p class="lifecycle-narrative">${lifecycle.narrative}</p>

                <div class="lifecycle-grid">
                    <div><b>Score Change</b><span>${signed(lifecycle.score_change)}</span></div>
                    <div><b>Confidence</b><span>${signed(lifecycle.confidence_change)}</span></div>
                    <div><b>First Seen</b><span>#${lifecycle.first_seen_scan}</span></div>
                    <div><b>Last Seen</b><span>#${lifecycle.last_seen_scan}</span></div>
                </div>

                <div class="lifecycle-event-list">
                    ${lifecycle.events.map(event => `
                        <div class="lifecycle-event">
                            <b>${event.event_type}</b>
                            <span>${event.message}</span>
                        </div>
                    `).join("")}
                </div>
            </div>
        </details>
    `;
}

function signed(value) {
    const number = Number(value || 0);
    return `${number >= 0 ? "+" : ""}${number.toFixed(1)}`;
}

function momentumSymbol(value) {
    if (value === "Improving") return "▲";
    if (value === "Degrading") return "▼";
    return "■";
}

window.lifecyclePanel = {
    renderLifecyclePanel,
};
