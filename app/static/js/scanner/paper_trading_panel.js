const executionClient = new window.ExecutionApiClient();

async function renderPaperTradingPanel() {
    const panel = document.getElementById("paperTradingPanel");
    if (!panel) return;

    try {
        const snapshot = await executionClient.snapshot();
        panel.innerHTML = `
            <div class="paper-header">
                <h3>Paper Trading</h3>
                <button id="resetPaperTradingButton">Reset</button>
            </div>

            <div class="paper-metrics">
                <div><b>Equity</b><span>$${Number(snapshot.equity).toFixed(2)}</span></div>
                <div><b>Cash</b><span>$${Number(snapshot.cash).toFixed(2)}</span></div>
                <div><b>Unrealized</b><span>$${Number(snapshot.unrealized_pnl).toFixed(2)}</span></div>
                <div><b>Realized</b><span>$${Number(snapshot.realized_pnl).toFixed(2)}</span></div>
            </div>

            <div class="paper-section">
                <h4>Open Positions</h4>
                ${snapshot.open_positions.length ? snapshot.open_positions.map(position => `
                    <div class="paper-row">
                        <b>${position.symbol}</b>
                        <span>${Number(position.quantity).toFixed(4)} @ ${Number(position.average_price).toFixed(2)}</span>
                        <em>$${Number(position.unrealized_pnl).toFixed(2)}</em>
                    </div>
                `).join("") : `<p class="muted">No open paper positions.</p>`}
            </div>

            <div class="paper-section">
                <h4>Recent Orders</h4>
                ${snapshot.orders.slice(-5).reverse().map(order => `
                    <div class="paper-row">
                        <b>${order.symbol}</b>
                        <span>${order.side.toUpperCase()} ${Number(order.quantity).toFixed(4)}</span>
                        <em>${order.status}</em>
                    </div>
                `).join("") || `<p class="muted">No orders yet.</p>`}
            </div>
        `;

        document.getElementById("resetPaperTradingButton")?.addEventListener("click", async () => {
            await executionClient.reset();
            await renderPaperTradingPanel();
            document.dispatchEvent(new CustomEvent("paper-trade-updated"));
        });
    } catch (error) {
        panel.innerHTML = `<p class="muted">Paper trading unavailable.</p>`;
    }
}

async function submitPaperOrderFromResult(result, side = "buy") {
    const quantity = Number(prompt(`Paper ${side.toUpperCase()} quantity for ${result.symbol}`, "1"));
    if (!quantity || quantity <= 0) return;

    await executionClient.submitOrder({
        symbol: result.symbol,
        side,
        quantity,
        order_type: "market",
        timeframe: result.timeframe,
        source: "scanner",
    });

    await renderPaperTradingPanel();
    document.dispatchEvent(new CustomEvent("paper-trade-updated"));
}

window.paperTradingPanel = {
    renderPaperTradingPanel,
    submitPaperOrderFromResult,
};
