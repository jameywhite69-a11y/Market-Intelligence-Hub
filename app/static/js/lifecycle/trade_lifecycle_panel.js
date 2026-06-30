async function refreshTradeLifecyclePanel() {
    const panel = document.getElementById("tradeLifecyclePanel");
    if (!panel) return;

    try {
        const snapshot = await window.tradeLifecycleClient.snapshot();
        renderTradeLifecyclePanel(snapshot);
    } catch (error) {
        panel.innerHTML = `<p class="muted">Trade lifecycle unavailable: ${error.message}</p>`;
    }
}

function renderTradeLifecyclePanel(snapshot) {
    const panel = document.getElementById("tradeLifecyclePanel");
    if (!panel) return;

    const records = snapshot?.records || [];

    panel.innerHTML = `
        <section class="trade-lifecycle-card">
            <div class="terminal-card-header">
                <h3>Trade Lifecycle</h3>
                <span>${records.length} tracked</span>
            </div>

            <div class="trade-lifecycle-flow">
                ${["Candidate","Watch","Qualified","Execution Ready","Entered","Managing","Partial Exit","Runner","Closed"].map(stage => `
                    <div class="trade-stage">${stage}</div>
                `).join("")}
            </div>

            <div class="trade-lifecycle-list">
                ${records.map(record => `
                    <div class="trade-lifecycle-row">
                        <div>
                            <b>${record.symbol}</b>
                            <span>${record.timeframe} · Score ${Number(record.score || 0).toFixed(1)}</span>
                        </div>
                        <strong>${record.stage}</strong>
                        <small>${record.events?.length ? record.events[record.events.length - 1].reason : "Lifecycle created."}</small>
                    </div>
                `).join("") || `<p class="muted">No lifecycle records yet. Select an opportunity to begin tracking.</p>`}
            </div>
        </section>
    `;
}

async function syncLifecycleFromSelectedOpportunity(payload) {
    const opportunity = payload?.opportunity || window.OpportunityStore?.getSelectedOpportunity?.();
    if (!opportunity) return;

    try {
        await window.tradeLifecycleClient.opportunity(opportunity, payload?.source || "workspace");
        await refreshTradeLifecyclePanel();
        window.EventBus?.publish?.("trade-lifecycle.updated", { opportunity });
    } catch (error) {
        window.WorkspaceStore?.pushError?.(error, "trade-lifecycle");
    }
}

async function syncLifecycleFromOrder(payload) {
    const order = payload?.order || payload;
    if (!order?.symbol) return;

    try {
        await window.tradeLifecycleClient.entered(order.symbol, order.timeframe || "15m", "paper-order");
        await refreshTradeLifecyclePanel();
    } catch (error) {
        window.WorkspaceStore?.pushError?.(error, "trade-lifecycle-order");
    }
}

window.EventBus?.subscribe?.("opportunity:selected", syncLifecycleFromSelectedOpportunity);
window.EventBus?.subscribe?.("paper-order-filled", syncLifecycleFromOrder);
window.EventBus?.subscribe?.("workspace.context.changed", refreshTradeLifecyclePanel);
document.addEventListener("DOMContentLoaded", () => setTimeout(refreshTradeLifecyclePanel, 350));

window.TradeLifecyclePanel = {
    refreshTradeLifecyclePanel,
    syncLifecycleFromSelectedOpportunity,
};
