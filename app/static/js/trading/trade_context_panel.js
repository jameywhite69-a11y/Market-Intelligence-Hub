function renderTradeContextPanel(context = window.TradeContext?.getCurrent?.()) {
    const panel = document.getElementById("tradeContextPanel");
    if (!panel) return;

    if (!context) {
        panel.innerHTML = `
            <section class="trade-context-card">
                <h3>Trade Context</h3>
                <p class="muted">No opportunity selected.</p>
            </section>
        `;
        return;
    }

    const lifecycle = window.LifecycleEngine?.getState?.(context);
    const risk = window.RiskEngine?.estimateFromContext?.(context);

    panel.innerHTML = `
        <section class="trade-context-card">
            <div class="trade-context-header">
                <div>
                    <h3>${context.symbol} ${context.timeframe}</h3>
                    <span>${context.status} · ${context.confidence}</span>
                </div>
                <strong>${context.score.toFixed(1)}</strong>
            </div>

            <div class="trade-context-grid">
                <div><b>Lifecycle</b><span>${lifecycle?.state || "Candidate"}</span></div>
                <div><b>Expected R</b><span>${context.expectedR.toFixed(2)}R</span></div>
                <div><b>Risk Qty</b><span>${risk ? risk.quantity.toFixed(4) : "—"}</span></div>
                <div><b>Notional</b><span>${risk ? "$" + risk.notional.toFixed(2) : "—"}</span></div>
            </div>
        </section>
    `;
}

window.EventBus?.subscribe("trade-context:selected", renderTradeContextPanel);
window.EventBus?.subscribe("lifecycle:updated", () => renderTradeContextPanel());
window.EventBus?.subscribe("paper-order-filled", () => renderTradeContextPanel());

window.TradeContextPanel = {
    renderTradeContextPanel,
};
