(function () {
    const STORAGE_KEY = "mih.activity.timeline.v42";
    const MAX_EVENTS = 300;
    let events = load();

    function load() {
        try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); }
        catch { return []; }
    }

    function save() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(events.slice(-MAX_EVENTS)));
    }

    function addEvent(type, payload = {}, source = "system") {
        const symbol = payload.symbol || payload.opportunity?.symbol || payload.context?.symbol || payload.plan?.symbol || payload.order?.symbol || null;
        const timeframe = payload.timeframe || payload.opportunity?.timeframe || payload.context?.timeframe || payload.plan?.timeframe || payload.order?.timeframe || null;

        const event = {
            id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
            type,
            source,
            symbol,
            timeframe,
            title: buildTitle(type, symbol),
            detail: buildDetail(type, payload),
            severity: buildSeverity(type),
            payload,
            timestamp: new Date().toISOString(),
        };

        events.push(event);
        events = events.slice(-MAX_EVENTS);
        save();

        window.WorkspaceStore?.set?.("activityTimeline", events.slice());
        window.EventBus?.publish?.("activity.timeline.updated", { event, events: events.slice() });

        return event;
    }

    function buildTitle(type, symbol) {
        const labels = {
            "scanner.completed": "Scanner completed",
            "opportunity.selected": "Opportunity selected",
            "workspace.context.changed": "Workspace context updated",
            "strategy.executed": "Strategy executed",
            "paper.order.filled": "Paper order filled",
            "paper.order.rejected": "Paper order rejected",
            "broker.changed": "Broker changed",
            "market-data.connected": "Market data connected",
            "market-data.disconnected": "Market data disconnected",
            "lifecycle.changed": "Lifecycle updated",
            "timeline.started": "Timeline started",
        };
        return `${labels[type] || type}${symbol ? ` · ${symbol}` : ""}`;
    }

    function buildDetail(type, payload) {
        if (payload.detail) return payload.detail;
        if (payload.reason) return payload.reason;
        if (payload.context?.lifecycle) return `Lifecycle: ${payload.context.lifecycle}`;
        if (payload.opportunity?.score !== undefined) return `Score: ${Number(payload.opportunity.score).toFixed(1)}`;
        if (payload.order?.quantity !== undefined) return `${payload.order.side || ""} ${payload.order.quantity}`;
        return payload.source ? `Source: ${payload.source}` : "Recorded";
    }

    function buildSeverity(type) {
        if (type.includes("rejected") || type.includes("error")) return "danger";
        if (type.includes("filled") || type.includes("executed") || type.includes("connected")) return "success";
        if (type.includes("selected") || type.includes("planned")) return "info";
        return "neutral";
    }

    function clear() {
        events = [];
        save();
        window.WorkspaceStore?.set?.("activityTimeline", []);
        window.EventBus?.publish?.("activity.timeline.cleared", {});
    }

    window.ActivityTimelineStore = {
        addEvent,
        clear,
        list: (limit = 50) => events.slice(-limit).reverse(),
        load,
    };
})();
