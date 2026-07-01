/*
Version 45.0 — Global Event Recorder

Records critical platform events for debugging and development support.
*/

(function () {
    const KEY = "tios.event.recorder.v45";
    const MAX = 500;
    let records = load();

    function load() {
        try { return JSON.parse(localStorage.getItem(KEY) || "[]"); }
        catch { return []; }
    }

    function save() {
        localStorage.setItem(KEY, JSON.stringify(records.slice(-MAX)));
    }

    function record(type, payload = {}, source = "event-bus") {
        const row = {
            id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
            type,
            source,
            symbol: payload.opportunity?.symbol || payload.symbol || null,
            detail: payload.detail || payload.reason || "",
            timestamp: new Date().toISOString(),
        };

        records.push(row);
        records = records.slice(-MAX);
        save();

        window.WorkspaceStore?.set?.("eventRecorder", records.slice());
        window.EventBus?.publish?.("event-recorder.updated", { record: row, records: records.slice() });

        return row;
    }

    function list(limit = 100) {
        return records.slice(-limit).reverse();
    }

    function clear() {
        records = [];
        save();
        window.WorkspaceStore?.set?.("eventRecorder", []);
        window.EventBus?.publish?.("event-recorder.cleared", {});
    }

    function subscribe(type) {
        window.EventBus?.subscribe?.(type, payload => record(type, payload, "event-bus"));
    }

    document.addEventListener("DOMContentLoaded", () => {
        setTimeout(() => {
            [
                "unified-opportunity.changed",
                "workspace.sync.started",
                "workspace.sync.completed",
                "risk.assessed",
                "paper-order-filled",
                "paper-order-rejected",
                "strategy-registry.selected",
                "command-center.updated",
                "dock:tab-changed",
                "platform.validation"
            ].forEach(subscribe);

            record("event-recorder.started", { detail: "Event Recorder online." }, "recorder");
        }, 500);
    });

    window.GlobalEventRecorder = {
        record,
        list,
        clear,
    };
})();
