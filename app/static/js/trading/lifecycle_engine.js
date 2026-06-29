/*
Version 34.0 — Position Lifecycle Engine

Tracks selected opportunities through simple institutional lifecycle states.
*/

(function () {
    const lifecycle = new Map();

    function getKey(context) {
        return context?.key || `${context?.symbol}-${context?.timeframe}`;
    }

    function setState(context, state, note = "") {
        if (!context) return;

        const key = getKey(context);
        const record = {
            key,
            symbol: context.symbol,
            timeframe: context.timeframe,
            state,
            note,
            updatedAt: new Date().toISOString(),
        };

        lifecycle.set(key, record);
        window.EventBus?.publish("lifecycle:updated", record);
        return record;
    }

    function getState(context) {
        return lifecycle.get(getKey(context)) || null;
    }

    window.EventBus?.subscribe("trade-context:selected", context => {
        if (!getState(context)) {
            setState(context, "Candidate", "Opportunity selected.");
        }
    });

    window.EventBus?.subscribe("paper-order-created", order => {
        const context = window.TradeContext?.getCurrent?.();
        setState(context, "Entry Pending", `Paper ${order.side} order submitted.`);
    });

    window.EventBus?.subscribe("paper-order-filled", order => {
        const context = window.TradeContext?.getCurrent?.();
        setState(context, "Filled", `Paper ${order.side} order filled.`);
    });

    window.LifecycleEngine = {
        setState,
        getState,
        lifecycle,
    };
})();
