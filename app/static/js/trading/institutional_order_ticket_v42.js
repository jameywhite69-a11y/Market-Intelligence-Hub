/*
Version 42.2 — Institutional Order Ticket

Commercial-grade order ticket that reads from WorkspaceContext and selected opportunity.
It does not replace the broker adapter; it submits through the existing ExecutionApiClient.
*/

(function () {
    const executionClient = new window.ExecutionApiClient();

    function selectedOpportunity() {
        return window.WorkspaceContext?.snapshot?.()?.selectedOpportunity ||
               window.OpportunityStore?.getSelectedOpportunity?.() ||
               null;
    }

    function estimate(opportunity) {
        const price = Number(
            opportunity?.entry_price ??
            opportunity?.price ??
            opportunity?.current_price ??
            opportunity?.technical?.current_price ??
            199
        );

        const stop = Number(
            opportunity?.stop_loss ??
            opportunity?.technical?.stop_loss ??
            price * 0.97
        );

        const target1 = Number(
            opportunity?.target_1 ??
            opportunity?.technical?.target_1 ??
            price * 1.02
        );

        const target2 = Number(
            opportunity?.target_2 ??
            opportunity?.technical?.target_2 ??
            price * 1.04
        );

        const equity = Number(window.WorkspaceStore?.get?.("executionSnapshot")?.equity || 100000);
        const riskPercent = 1.0;
        const dollarRisk = equity * (riskPercent / 100);
        const riskPerUnit = Math.max(0.0001, Math.abs(price - stop));
        const quantity = dollarRisk / riskPerUnit;
        const notional = quantity * price;
        const expectedR = Math.abs(target2 - price) / riskPerUnit;

        return {
            price,
            stop,
            target1,
            target2,
            equity,
            riskPercent,
            dollarRisk,
            quantity,
            notional,
            expectedR,
        };
    }

    function renderInstitutionalOrderTicket() {
        const panel = document.getElementById("institutionalOrderTicketV42") ||
                      document.getElementById("institutionalOrderTicket");
        if (!panel) return;

        const context = window.WorkspaceContext?.snapshot?.() || {};
        const opportunity = selectedOpportunity();

        if (!opportunity) {
            panel.innerHTML = `
                <section class="institutional-ticket-card">
                    <div class="terminal-card-header">
                        <h3>Institutional Order Ticket</h3>
                        <span>Waiting</span>
                    </div>
                    <p class="muted">Select an opportunity to auto-build a professional execution ticket.</p>
                </section>
            `;
            return;
        }

        const risk = estimate(opportunity);

        panel.innerHTML = `
            <section class="institutional-ticket-card">
                <div class="terminal-card-header">
                    <h3>Institutional Order Ticket</h3>
                    <span>${context.broker || "paper"}</span>
                </div>

                <div class="ticket-symbol-row">
                    <div>
                        <b>${opportunity.symbol}</b>
                        <span>${opportunity.timeframe || context.timeframe || "15m"} · Score ${Number(opportunity.score || 0).toFixed(1)}</span>
                    </div>
                    <strong>${Number(risk.expectedR).toFixed(2)}R</strong>
                </div>

                <div class="institutional-ticket-grid">
                    <label>Side</label>
                    <select id="v42TicketSide">
                        <option value="buy">Buy</option>
                        <option value="sell">Sell</option>
                    </select>

                    <label>Order Type</label>
                    <select id="v42TicketOrderType">
                        <option value="market">Market</option>
                        <option value="limit">Limit</option>
                        <option value="stop">Stop</option>
                    </select>

                    <label>Entry</label>
                    <input id="v42TicketEntry" type="number" step="0.0001" value="${risk.price.toFixed(4)}">

                    <label>Stop</label>
                    <input id="v42TicketStop" type="number" step="0.0001" value="${risk.stop.toFixed(4)}">

                    <label>Target 1</label>
                    <input id="v42TicketTarget1" type="number" step="0.0001" value="${risk.target1.toFixed(4)}">

                    <label>Target 2</label>
                    <input id="v42TicketTarget2" type="number" step="0.0001" value="${risk.target2.toFixed(4)}">

                    <label>Risk %</label>
                    <input id="v42TicketRiskPercent" type="number" step="0.1" value="${risk.riskPercent.toFixed(1)}">

                    <label>Quantity</label>
                    <input id="v42TicketQuantity" type="number" step="0.0001" value="${risk.quantity.toFixed(4)}">
                </div>

                <div class="ticket-risk-summary institutional">
                    <div><b>Dollar Risk</b><span>$${risk.dollarRisk.toFixed(2)}</span></div>
                    <div><b>Notional</b><span>$${risk.notional.toFixed(2)}</span></div>
                    <div><b>Expected R</b><span>${risk.expectedR.toFixed(2)}R</span></div>
                    <div><b>Broker</b><span>${context.broker || "paper"}</span></div>
                </div>

                <div class="ticket-action-row">
                    <button id="v42SubmitPaperOrderButton">Submit Paper Order</button>
                    <button id="v42RecalculateTicketButton" class="secondary-button">Recalculate</button>
                </div>

                <div id="v42TicketMessage" class="ticket-message"></div>
            </section>
        `;

        document.getElementById("v42SubmitPaperOrderButton")?.addEventListener("click", submitInstitutionalOrder);
        document.getElementById("v42RecalculateTicketButton")?.addEventListener("click", renderInstitutionalOrderTicket);
    }

    async function submitInstitutionalOrder() {
        const opportunity = selectedOpportunity();
        const message = document.getElementById("v42TicketMessage");
        if (!opportunity) return;

        const quantity = Number(document.getElementById("v42TicketQuantity")?.value || 0);
        const entry = Number(document.getElementById("v42TicketEntry")?.value || 0);

        if (!quantity || quantity <= 0) {
            if (message) message.textContent = "Quantity must be greater than zero.";
            return;
        }

        try {
            const order = await executionClient.submitOrder({
                symbol: opportunity.symbol,
                timeframe: opportunity.timeframe || "15m",
                side: document.getElementById("v42TicketSide")?.value || "buy",
                order_type: document.getElementById("v42TicketOrderType")?.value || "market",
                quantity,
                entry_price: entry,
                stop_loss: Number(document.getElementById("v42TicketStop")?.value || 0),
                take_profit: Number(document.getElementById("v42TicketTarget2")?.value || 0),
                expected_r: Number(selectedOpportunity()?.expectedR || 0),
                source: "institutional-ticket-v42",
            });

            if (message) {
                message.textContent = order.accepted
                    ? `Filled: ${order.side.toUpperCase()} ${Number(order.quantity).toFixed(4)} ${order.symbol}`
                    : order.reason || "Order rejected.";
            }

            window.WorkspaceContext?.setLifecycle?.(order.accepted ? "Position Opened" : "Order Rejected");
            window.EventBus?.publish?.(order.accepted ? "paper-order-filled" : "paper-order-rejected", order);
            document.dispatchEvent(new CustomEvent("paper-trade-updated"));
        } catch (error) {
            if (message) message.textContent = error.message;
            window.WorkspaceStore?.pushError?.(error, "institutional-order-ticket-v42");
        }
    }

    window.EventBus?.subscribe?.("workspace.context.changed", renderInstitutionalOrderTicket);
    window.EventBus?.subscribe?.("opportunity:selected", renderInstitutionalOrderTicket);
    window.EventBus?.subscribe?.("paper-order-filled", renderInstitutionalOrderTicket);
    document.addEventListener("DOMContentLoaded", () => setTimeout(renderInstitutionalOrderTicket, 300));

    window.InstitutionalOrderTicketV42 = {
        renderInstitutionalOrderTicket,
        submitInstitutionalOrder,
    };
})();
