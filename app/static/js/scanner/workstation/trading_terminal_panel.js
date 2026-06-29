const terminalExecutionClient = new window.ExecutionApiClient();

async function renderTradingTerminalPanel() {
    const panel = document.getElementById("tradingTerminalPanel");
    if (!panel) return;

    try {
        const snapshot = await terminalExecutionClient.snapshot();
        const positions = snapshot.open_positions || [];
        const orders = snapshot.orders || [];

        panel.innerHTML = `
            <section class="terminal-trade-card">
                <div class="terminal-card-header">
                    <h3>Trading Terminal</h3>
                    <span>Paper Execution</span>
                </div>

                <div class="terminal-account-grid">
                    <div><b>Equity</b><span>$${Number(snapshot.equity).toFixed(2)}</span></div>
                    <div><b>Buying Power</b><span>$${Number(snapshot.buying_power).toFixed(2)}</span></div>
                    <div><b>Realized P&L</b><span>$${Number(snapshot.realized_pnl).toFixed(2)}</span></div>
                    <div><b>Open P&L</b><span>$${Number(snapshot.unrealized_pnl).toFixed(2)}</span></div>
                    <div><b>Trades</b><span>${snapshot.trade_count}</span></div>
                    <div><b>Win Rate</b><span>${Number(snapshot.win_rate).toFixed(1)}%</span></div>
                </div>
            </section>

            <section class="terminal-trade-card">
                <div class="terminal-card-header">
                    <h3>Open Positions</h3>
                    <span>${positions.length} open</span>
                </div>

                <div class="terminal-position-list">
                    ${positions.length ? positions.map(position => `
                        <div class="terminal-position-row">
                            <div>
                                <b>${position.symbol}</b>
                                <small>${position.side.toUpperCase()}</small>
                            </div>
                            <div><span>${Number(position.quantity).toFixed(4)}</span><small>Qty</small></div>
                            <div><span>$${Number(position.average_price).toFixed(2)}</span><small>Avg</small></div>
                            <div><span>$${Number(position.market_price).toFixed(2)}</span><small>Mark</small></div>
                            <div class="${Number(position.unrealized_pnl) >= 0 ? "positive-pnl" : "negative-pnl"}">
                                <span>$${Number(position.unrealized_pnl).toFixed(2)}</span>
                                <small>Open P&L</small>
                            </div>
                            <button data-close-position="${position.symbol}" data-qty="${position.quantity}">Close</button>
                        </div>
                    `).join("") : `<p class="muted">No open paper positions.</p>`}
                </div>
            </section>

            <section class="terminal-trade-card">
                <div class="terminal-card-header">
                    <h3>Order Blotter</h3>
                    <span>Last ${Math.min(orders.length, 10)}</span>
                </div>

                <div class="terminal-order-list">
                    ${orders.slice(-10).reverse().map(order => `
                        <div class="terminal-order-row">
                            <b>${order.symbol}</b>
                            <span>${order.side.toUpperCase()}</span>
                            <span>${Number(order.quantity).toFixed(4)}</span>
                            <span>${order.status}</span>
                            <span>$${Number(order.fill_price || order.requested_price || 0).toFixed(2)}</span>
                        </div>
                    `).join("") || `<p class="muted">No paper orders yet.</p>`}
                </div>
            </section>
        `;

        for (const button of panel.querySelectorAll("[data-close-position]")) {
            button.addEventListener("click", async () => {
                await terminalExecutionClient.submitOrder({
                    symbol: button.dataset.closePosition,
                    side: "sell",
                    quantity: Number(button.dataset.qty),
                    order_type: "market",
                    timeframe: "15m",
                    source: "terminal-close",
                });

                await renderTradingTerminalPanel();
                if (window.paperTradingPanel) await window.paperTradingPanel.renderPaperTradingPanel();
                document.dispatchEvent(new CustomEvent("paper-trade-updated"));
            });
        }
    } catch (error) {
        panel.innerHTML = `<p class="muted">Trading terminal unavailable.</p>`;
    }
}

window.tradingTerminalPanel = {
    renderTradingTerminalPanel,
};
