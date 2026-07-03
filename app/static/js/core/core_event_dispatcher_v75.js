/*
Version 75.0 — Core Event Dispatcher Refactor
Purpose:
- Creates a canonical platform event pipeline.
- Bridges existing EventBus events into one state dispatcher.
- Reduces duplicate event storms and prepares module registry/lifecycle refactor.
- No broker execution.
*/
(function () {
    const VERSION = "75.0";

    const STATE = {
        revision: 0,
        lastEvent: null,
        state: {
            market: {},
            realtime: {},
            selected: {},
            portfolio: {},
            execution: {},
            analytics: {},
            automation: {}
        },
        subscribers: new Set(),
        eventLog: []
    };

    function clone(value) {
        try { return JSON.parse(JSON.stringify(value)); }
        catch { return value; }
    }

    function log(type, payload) {
        STATE.lastEvent = type;
        STATE.eventLog.unshift({
            time: new Date().toLocaleTimeString(),
            type,
            payload: clone(payload)
        });
        STATE.eventLog = STATE.eventLog.slice(0, 100);
    }

    function snapshot() {
        return {
            version: VERSION,
            revision: STATE.revision,
            lastEvent: STATE.lastEvent,
            state: clone(STATE.state),
            eventLog: clone(STATE.eventLog)
        };
    }

    function emit(type, payload, reducer) {
        if (typeof reducer === "function") {
            reducer(STATE.state, payload);
        }

        STATE.revision += 1;
        log(type, payload);

        const snap = snapshot();

        STATE.subscribers.forEach(fn => {
            try { fn(snap, type, payload); }
            catch (err) { console.warn("[CoreEventDispatcherV75 subscriber]", err); }
        });

        if (window.EventBus?.publish && type !== "core-dispatcher.updated") {
            window.EventBus.publish("core-dispatcher.updated", snap);
        }

        render();
        return snap;
    }

    function subscribe(fn) {
        STATE.subscribers.add(fn);
        setTimeout(() => fn(snapshot(), "bootstrap", null), 0);
        return () => STATE.subscribers.delete(fn);
    }

    function bridgeEventBus() {
        if (!window.EventBus?.subscribe) {
            setTimeout(bridgeEventBus, 200);
            return;
        }

        const bridge = [
            ["realtime-data.updated", (s, p) => { s.realtime = p || {}; }],
            ["market-context-store.updated", (s, p) => {
                s.market = p?.marketContext || p?.state?.market || p || {};
                s.selected = p?.selected || s.selected || {};
            }],
            ["institutional-market-context.updated", (s, p) => { s.market = p || {}; }],
            ["scanner.selection.changed", (s, p) => { s.selected = p?.value || p || {}; }],
            ["portfolio-intelligence-store.updated", (s, p) => { s.portfolio = p || {}; }],
            ["execution-workflow.updated", (s, p) => { s.execution.workflow = p?.workflow || p || {}; }],
            ["execution-service.order-staged", (s, p) => { s.execution.latestOrder = p?.order || {}; }],
            ["live-order-manager.updated", (s, p) => { s.execution.liveOrders = p || {}; }],
            ["performance-analytics.updated", (s, p) => { s.analytics = p || {}; }],
            ["workflow-automation.updated", (s, p) => { s.automation = p || {}; }]
        ];

        bridge.forEach(([eventName, reducer]) => {
            window.EventBus.subscribe(eventName, payload => emit(eventName, payload, reducer));
        });

        console.log("[CoreEventDispatcherV75] bridged EventBus", bridge.length);
    }

    function render() {
        const panel = document.getElementById("coreEventDispatcherPanelV75");
        if (!panel) return;

        const snap = snapshot();

        panel.innerHTML = `
            <section class="v75-card">
                <div class="v75-header">
                    <div>
                        <h2>Core Event Dispatcher</h2>
                        <span>canonical event pipeline · revision ${snap.revision}</span>
                    </div>
                    <strong>${snap.lastEvent || "READY"}</strong>
                </div>

                <div class="v75-grid">
                    <div><small>Revision</small><b>${snap.revision}</b></div>
                    <div><small>Selected</small><b>${snap.state.selected?.symbol || "—"}</b></div>
                    <div><small>Market</small><b>${snap.state.market?.regime || "—"}</b></div>
                    <div><small>Orders</small><b>${snap.state.execution?.liveOrders?.orders?.length || 0}</b></div>
                    <div><small>Analytics</small><b>${snap.state.analytics?.totalTrades || 0}</b></div>
                    <div><small>Events</small><b>${snap.eventLog.length}</b></div>
                </div>
            </section>
        `;
    }

    function init() {
        bridgeEventBus();
        render();
        document.body.dataset.coreEventDispatcher = VERSION;
    }

    window.CoreEventDispatcherV75 = {
        emit,
        subscribe,
        snapshot,
        render,
        version: VERSION
    };

    document.addEventListener("DOMContentLoaded", () => setTimeout(init, 800));
})();
