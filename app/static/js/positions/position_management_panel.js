async function fetchManagedPositions() {
    const response = await fetch("/api/positions/managed", {headers: {"Accept": "application/json"}});
    if (!response.ok) throw new Error(`Position management failed: ${response.status}`);
    return await response.json();
}

function lifecycleClass(lifecycle) {
    return `lifecycle-${String(lifecycle || "").toLowerCase().replaceAll(" ", "-")}`;
}

function renderManagedPositions(payload) {
    const panel = document.getElementById("positionManagementPanel");
    if (!panel) return;

    const positions = payload?.managed_positions || [];

    panel.innerHTML = `
        <section class="position-management-card">
            <div class="terminal-card-header">
                <h3>Position Management</h3>
                <span>${positions.length} managed</span>
            </div>
            ${positions.length ? positions.map(position => `
                <div class="managed-position-row">
                    <div class="managed-position-top">
                        <div>
                            <b>${position.symbol}</b>
                            <span class="${lifecycleClass(position.lifecycle)}">${position.lifecycle}</span>
                        </div>
                        <strong>${Number(position.r_multiple || 0).toFixed(2)}R</strong>
                    </div>
                    <div class="managed-position-grid">
                        <div><b>Entry</b><span>${Number(position.entry_price || 0).toFixed(2)}</span></div>
                        <div><b>Current</b><span>${Number(position.current_price || 0).toFixed(2)}</span></div>
                        <div><b>Stop</b><span>${Number(position.stop_loss || 0).toFixed(2)}</span></div>
                        <div><b>TP1</b><span>${Number(position.target_1 || 0).toFixed(2)}</span></div>
                        <div><b>TP2</b><span>${Number(position.target_2 || 0).toFixed(2)}</span></div>
                        <div><b>Trail</b><span>${Number(position.trailing_stop || 0).toFixed(2)}</span></div>
                    </div>
                    <div class="position-rule-list">
                        ${(position.rules || []).map(rule => `
                            <div class="position-rule-row">
                                <b>${rule.rule_type}</b>
                                <span>${rule.status}</span>
                            </div>
                        `).join("")}
                    </div>
                </div>
            `).join("") : `<p class="muted">No open positions to manage.</p>`}
        </section>
    `;
}

async function renderPositionManagementPanel() {
    const panel = document.getElementById("positionManagementPanel");
    if (!panel) return;
    try {
        renderManagedPositions(await fetchManagedPositions());
    } catch (error) {
        panel.innerHTML = `<p class="muted">Position management unavailable: ${error.message}</p>`;
    }
}

document.addEventListener("paper-trade-updated", renderPositionManagementPanel);
window.EventBus?.subscribe?.("paper-order-filled", renderPositionManagementPanel);
window.EventBus?.subscribe?.("scan:completed", renderPositionManagementPanel);

window.PositionManagementPanel = {renderPositionManagementPanel};
