const orderTicketExecutionClient = new window.ExecutionApiClient();

function renderOrderTicket(context = window.TradeContext?.getCurrent?.()) {
    const panel = document.getElementById("institutionalOrderTicket");
    if (!panel) return;

    if (!context) {
        panel.innerHTML = `
            <section class="order-ticket-card">
                <div class="order-ticket-header">
                    <h3>Order Ticket</h3>
                    <span>No selection</span>
                </div>
                <p class="muted">Select an opportunity to prepare a paper order.</p>
            </section>
        `;
        return;
    }

    const risk = window.RiskEngine.estimateFromContext(context);

    panel.innerHTML = `
        <section class="order-ticket-card">
            <div class="order-ticket-header">
                <h3>${context.symbol} ${context.timeframe}</h3>
                <span>${context.status}</span>
            </div>

            <div class="ticket-grid">
                <label>Side</label>
                <select id="ticketSide">
                    <option value="buy">Buy</option>
                    <option value="sell">Sell</option>
                </select>

                <label>Order Type</label>
                <select id="ticketOrderType">
                    <option value="market">Market</option>
                    <option value="limit">Limit</option>
                    <option value="stop">Stop</option>
                </select>

                <label>Quantity</label>
                <input id="ticketQuantity" type="number" step="0.0001" value="${risk.quantity.toFixed(4)}">

                <label>Entry</label>
                <input id="ticketEntry" type="number" step="0.01" value="${risk.entryPrice.toFixed(2)}">

                <label>Stop</label>
                <input id="ticketStop" type="number" step="0.01" value="${risk.stopPrice.toFixed(2)}">

                <label>Target</label>
                <input id="ticketTarget" type="number" step="0.01" value="${risk.targetPrice.toFixed(2)}">
            </div>

            <div class="ticket-risk-summary">
                <div><b>Dollar Risk</b><span>$${risk.dollarRisk.toFixed(2)}</span></div>
                <div><b>Notional</b><span>$${risk.notional.toFixed(2)}</span></div>
                <div><b>Expected R</b><span>${risk.expectedR.toFixed(2)}R</span></div>
                <div><b>Allocation Cap</b><span>${risk.maxAllocationPercent.toFixed(1)}%</span></div>
            </div>

            <button id="submitTicketOrderButton" class="ticket-submit">Submit Paper Order</button>
            <div id="ticketOrderMessage" class="ticket-message"></div>
        </section>
    `;

    document.getElementById("submitTicketOrderButton")?.addEventListener("click", submitTicketOrder);
}

async function submitTicketOrder() {
    const context = window.TradeContext?.getCurrent?.();
    const message = document.getElementById("ticketOrderMessage");
    if (!context) return;

    const quantity = Number(document.getElementById("ticketQuantity")?.value || 0);

    if (!quantity || quantity <= 0) {
        if (message) message.textContent = "Quantity must be greater than zero.";
        return;
    }

    const orderPayload = {
        symbol: context.symbol,
        timeframe: context.timeframe,
        side: document.getElementById("ticketSide")?.value || "buy",
        order_type: document.getElementById("ticketOrderType")?.value || "market",
        quantity,
        entry_price: Number(document.getElementById("ticketEntry")?.value || 0),
        stop_loss: Number(document.getElementById("ticketStop")?.value || 0),
        take_profit: Number(document.getElementById("ticketTarget")?.value || 0),
        confidence: context.confidence,
        expected_r: context.expectedR,
        allocation: context.allocation,
        source: "institutional-ticket",
    };

    try {
        const order = await orderTicketExecutionClient.submitOrder(orderPayload);

        if (!order.accepted) {
            if (message) message.textContent = order.reason || "Order rejected.";
            window.EventBus?.publish("paper-order-rejected", order);
            return;
        }

        if (message) message.textContent = `Order filled: ${order.side.toUpperCase()} ${order.quantity} ${order.symbol}`;
        window.EventBus?.publish("paper-order-created", order);
        window.EventBus?.publish("paper-order-filled", order);
        document.dispatchEvent(new CustomEvent("paper-trade-updated"));
    } catch (error) {
        if (message) message.textContent = error.message;
        window.WorkspaceStore?.pushError?.(error, "order-ticket");
    }
}

window.EventBus?.subscribe("trade-context:selected", renderOrderTicket);
document.addEventListener("paper-trade-updated", () => renderOrderTicket());

window.OrderTicket = {
    renderOrderTicket,
    submitTicketOrder,
};
