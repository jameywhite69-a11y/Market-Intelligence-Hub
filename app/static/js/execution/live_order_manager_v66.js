/*
Version 66.0 — Live Order Management Framework
Purpose:
- Manage paper/live-ready order states through one order manager.
- Default remains PAPER.
- Does not connect to or submit to a live broker.
*/
(function () {
    const VERSION = "66.0";

    const STATE = {
        mode: "paper",
        orders: [],
        active: [],
        closed: [],
        events: []
    };

    function now() {
        return new Date().toLocaleTimeString();
    }

    function log(message, data) {
        STATE.events.unshift({ time: now(), message, data: data || {} });
        STATE.events = STATE.events.slice(0, 100);
    }

    function latestExecutionOrder() {
        const svc = window.ExecutionServiceV65?.snapshot?.();
        return svc?.orders?.[0] || null;
    }

    function normalize(order) {
        order = order || latestExecutionOrder() || {};
        return {
            id: order.id || `LM-${Date.now()}`,
            symbol: order.symbol || "—",
            side: order.side || "BUY",
            qty: Number(order.qty || order.units || 0),
            entry: Number(order.entry || 0),
            stop: Number(order.stop || 0),
            tp1: Number(order.tp1 || 0),
            tp2: Number(order.tp2 || 0),
            status: order.status || "STAGED",
            mode: STATE.mode,
            createdAt: order.createdAt || new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
    }

    function upsert(order, reason) {
        const normalized = normalize(order);
        const existing = STATE.orders.findIndex(x => x.id === normalized.id);

        if (existing >= 0) STATE.orders[existing] = normalized;
        else STATE.orders.unshift(normalized);

        if (["FILLED", "MANAGING", "PARTIAL", "RUNNER"].includes(normalized.status)) {
            const activeIdx = STATE.active.findIndex(x => x.id === normalized.id);
            if (activeIdx >= 0) STATE.active[activeIdx] = normalized;
            else STATE.active.unshift(normalized);
        }

        if (["CLOSED", "CANCELLED"].includes(normalized.status)) {
            STATE.closed.unshift(normalized);
            STATE.active = STATE.active.filter(x => x.id !== normalized.id);
        }

        log(`${reason}: ${normalized.symbol} ${normalized.status}`, normalized);
        publish();
        render();
        return normalized;
    }

    function updateStatus(id, status) {
        const order = STATE.orders.find(x => x.id === id) || STATE.orders[0];
        if (!order) return null;
        return upsert({ ...order, status, updatedAt: new Date().toISOString() }, "status update");
    }

    function publish() {
        window.EventBus?.publish?.("live-order-manager.updated", snapshot());
    }

    function snapshot() {
        return {
            version: VERSION,
            mode: STATE.mode,
            orders: STATE.orders.slice(),
            active: STATE.active.slice(),
            closed: STATE.closed.slice(),
            events: STATE.events.slice()
        };
    }

    function render() {
        const panel = document.getElementById("liveOrderManagerPanelV66");
        if (!panel) return;

        const s = snapshot();
        const latest = s.orders[0];

        panel.innerHTML = `
            <section class="v66-card">
                <div class="v66-header">
                    <div>
                        <h2>Live Order Manager</h2>
                        <span>paper/live-ready lifecycle controller</span>
                    </div>
                    <strong>${s.mode.toUpperCase()}</strong>
                </div>

                <div class="v66-grid">
                    <div><small>Total Orders</small><b>${s.orders.length}</b></div>
                    <div><small>Active</small><b>${s.active.length}</b></div>
                    <div><small>Closed</small><b>${s.closed.length}</b></div>
                    <div><small>Latest</small><b>${latest?.symbol || "—"}</b></div>
                    <div><small>Status</small><b>${latest?.status || "READY"}</b></div>
                    <div><small>Mode</small><b>${s.mode}</b></div>
                </div>

                <div class="v66-actions">
                    <button data-v66-action="import">Import Latest V65 Order</button>
                    <button data-v66-action="submitted">Mark Submitted</button>
                    <button data-v66-action="filled">Mark Filled</button>
                    <button data-v66-action="managing">Managing</button>
                    <button data-v66-action="closed">Close</button>
                </div>
            </section>
        `;

        panel.querySelector("[data-v66-action='import']")?.addEventListener("click", () => upsert(latestExecutionOrder(), "import"));
        panel.querySelector("[data-v66-action='submitted']")?.addEventListener("click", () => updateStatus(latest?.id, "SUBMITTED"));
        panel.querySelector("[data-v66-action='filled']")?.addEventListener("click", () => updateStatus(latest?.id, "FILLED"));
        panel.querySelector("[data-v66-action='managing']")?.addEventListener("click", () => updateStatus(latest?.id, "MANAGING"));
        panel.querySelector("[data-v66-action='closed']")?.addEventListener("click", () => updateStatus(latest?.id, "CLOSED"));
    }

    function wire() {
        window.EventBus?.subscribe?.("execution-service.order-staged", payload => upsert(payload?.order, "service staged"));
        window.EventBus?.subscribe?.("execution-service.order-submitted", payload => upsert(payload?.order, "service submitted"));
        window.EventBus?.subscribe?.("execution-service.fill", payload => upsert({ ...(payload?.order || {}), status: "FILLED" }, "service fill"));
        setTimeout(render, 1500);
    }

    window.LiveOrderManagerV66 = {
        upsert,
        updateStatus,
        snapshot,
        render,
        version: VERSION
    };

    document.addEventListener("DOMContentLoaded", () => setTimeout(wire, 1000));
})();
