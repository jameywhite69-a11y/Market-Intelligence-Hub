/*
Version 65.0 — Broker Abstraction Layer / Execution Service
Purpose:
- Provide one broker-neutral execution interface.
- Default adapter is PAPER only.
- No live broker orders are submitted by this module.
*/
(function () {
    const VERSION = "65.0";

    const STATE = {
        adapter: "paper",
        mode: "paper",
        orders: [],
        fills: [],
        log: []
    };

    function now() {
        return new Date().toLocaleTimeString();
    }

    function addLog(message, data) {
        STATE.log.unshift({
            time: now(),
            message,
            data: data || {}
        });
        STATE.log = STATE.log.slice(0, 100);
    }

    function latestPlan() {
        return window.ExecutionWorkflowEngineV60?.get?.()
            || window.InstitutionalTradeEngineV59?.current
            || window.UnifiedDecisionEngineV57?.get?.()
            || {};
    }

    function normalizeOrder(input) {
        const plan = input || latestPlan();
        const symbol = plan.symbol || "—";
        const side = plan.side || "BUY";
        const qty = Number(plan.units || plan.quantity || 0);
        const entry = Number(plan.entry || 0);
        const stop = Number(plan.stop || 0);
        const tp1 = Number(plan.tp1 || 0);
        const tp2 = Number(plan.tp2 || 0);
        const risk = Number(plan.riskDollars || 0);
        const notional = Number(plan.notional || qty * entry || 0);

        return {
            id: `PAPER-${Date.now()}`,
            adapter: STATE.adapter,
            mode: STATE.mode,
            status: "STAGED",
            symbol,
            side,
            qty,
            type: "BRACKET",
            entry,
            stop,
            tp1,
            tp2,
            risk,
            notional,
            createdAt: new Date().toISOString()
        };
    }

    function stageOrder(input) {
        const order = normalizeOrder(input);
        STATE.orders.unshift(order);
        addLog(`Order staged: ${order.side} ${order.symbol}`, order);

        window.EventBus?.publish?.("execution-service.order-staged", { order, state: snapshot() });
        render();
        return order;
    }

    function submitPaperOrder(orderId) {
        const order = STATE.orders.find(o => o.id === orderId) || STATE.orders[0];
        if (!order) return null;

        order.status = "SUBMITTED";
        order.submittedAt = new Date().toISOString();
        addLog(`Paper order submitted: ${order.symbol}`, order);

        const fill = {
            id: `FILL-${Date.now()}`,
            orderId: order.id,
            symbol: order.symbol,
            qty: order.qty,
            price: order.entry,
            status: "FILLED",
            filledAt: new Date().toISOString()
        };

        order.status = "FILLED";
        STATE.fills.unshift(fill);
        addLog(`Paper fill: ${fill.symbol}`, fill);

        window.EventBus?.publish?.("execution-service.order-submitted", { order, fill, state: snapshot() });
        window.EventBus?.publish?.("execution-service.fill", { fill, order, state: snapshot() });

        if (window.ExecutionWorkflowEngineV60?.advance) {
            window.ExecutionWorkflowEngineV60.advance("Filled");
        }

        render();
        return { order, fill };
    }

    function cancelOrder(orderId) {
        const order = STATE.orders.find(o => o.id === orderId);
        if (!order) return null;
        order.status = "CANCELLED";
        order.cancelledAt = new Date().toISOString();
        addLog(`Order cancelled: ${order.symbol}`, order);
        window.EventBus?.publish?.("execution-service.order-cancelled", { order, state: snapshot() });
        render();
        return order;
    }

    function snapshot() {
        return {
            version: VERSION,
            adapter: STATE.adapter,
            mode: STATE.mode,
            orders: STATE.orders.slice(),
            fills: STATE.fills.slice(),
            log: STATE.log.slice()
        };
    }

    function render() {
        const panel = document.getElementById("executionServicePanelV65");
        if (!panel) return;

        const latest = STATE.orders[0];

        panel.innerHTML = `
            <section class="v65-card">
                <div class="v65-header">
                    <div>
                        <h2>Execution Service</h2>
                        <span>Broker-neutral adapter · ${STATE.mode.toUpperCase()}</span>
                    </div>
                    <strong>${STATE.adapter.toUpperCase()}</strong>
                </div>

                <div class="v65-grid">
                    <div><small>Adapter</small><b>${STATE.adapter}</b></div>
                    <div><small>Mode</small><b>${STATE.mode}</b></div>
                    <div><small>Orders</small><b>${STATE.orders.length}</b></div>
                    <div><small>Fills</small><b>${STATE.fills.length}</b></div>
                    <div><small>Latest</small><b>${latest?.symbol || "—"}</b></div>
                    <div><small>Status</small><b>${latest?.status || "READY"}</b></div>
                </div>

                <div class="v65-action-row">
                    <button id="v65StageOrderButton" type="button">Stage Paper Order</button>
                    <button id="v65SubmitOrderButton" type="button">Submit Paper Order</button>
                    <button id="v65CancelOrderButton" type="button">Cancel Latest</button>
                </div>
            </section>
        `;

        document.getElementById("v65StageOrderButton")?.addEventListener("click", () => stageOrder());
        document.getElementById("v65SubmitOrderButton")?.addEventListener("click", () => submitPaperOrder());
        document.getElementById("v65CancelOrderButton")?.addEventListener("click", () => {
            if (STATE.orders[0]) cancelOrder(STATE.orders[0].id);
        });
    }

    function wire() {
        window.EventBus?.subscribe?.("institutional-trade-plan.updated", payload => {
            const plan = payload?.plan || payload;
            if (plan?.status === "READY TO EXECUTE") {
                stageOrder(plan);
            }
        });
        setTimeout(render, 1400);
    }

    window.ExecutionServiceV65 = {
        stageOrder,
        submitPaperOrder,
        cancelOrder,
        snapshot,
        render,
        version: VERSION
    };

    document.addEventListener("DOMContentLoaded", () => setTimeout(wire, 1000));
})();
