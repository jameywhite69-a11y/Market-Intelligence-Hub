(function () {
    const DEFAULT_CONTEXT = {
        symbol: null, timeframe: "15m", strategy: null, broker: "paper",
        account: "primary", watchlist: null, workspace: "professional",
        layout: "institutional", selectedOpportunity: null, selectedOpportunityKey: null,
        lifecycle: "Idle", updatedAt: null
    };
    const STORAGE_KEY = "mih.workspace.context.v42";
    let context = loadContext();

    function loadContext() {
        try { return { ...DEFAULT_CONTEXT, ...JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}") }; }
        catch { return { ...DEFAULT_CONTEXT }; }
    }
    function persist() { localStorage.setItem(STORAGE_KEY, JSON.stringify(context)); }
    function snapshot() { return JSON.parse(JSON.stringify(context)); }
    function publish(changeType, payload) {
        const event = { type: changeType, context: snapshot(), payload, timestamp: new Date().toISOString() };
        window.WorkspaceStore?.set?.("workspaceContext", event.context);
        window.EventBus?.publish?.("workspace.context.changed", event);
        window.EventBus?.publish?.(`workspace.${changeType}.changed`, event);
        document.dispatchEvent(new CustomEvent("workspace.context.changed", { detail: event }));
    }
    function update(patch, changeType = "context") {
        context = { ...context, ...patch, updatedAt: new Date().toISOString() };
        persist(); publish(changeType, patch); return snapshot();
    }
    function setSelectedOpportunity(opportunity, source = "unknown") {
        const normalized = window.OpportunityStore?.normalizeOpportunity ? window.OpportunityStore.normalizeOpportunity(opportunity) : opportunity;
        return update({
            selectedOpportunity: normalized,
            selectedOpportunityKey: normalized?.key || null,
            symbol: normalized?.symbol || context.symbol,
            timeframe: normalized?.timeframe || context.timeframe,
            lifecycle: normalized ? "Opportunity Selected" : context.lifecycle,
            selectionSource: source
        }, "opportunity");
    }
    window.WorkspaceContext = {
        snapshot, update,
        restore: () => { publish("restored", {}); return snapshot(); },
        reset: () => { context = { ...DEFAULT_CONTEXT, updatedAt: new Date().toISOString() }; persist(); publish("reset", {}); return snapshot(); },
        setSymbol: (symbol, timeframe = context.timeframe) => update({ symbol: symbol ? String(symbol).toUpperCase() : null, timeframe }, "symbol"),
        setStrategy: strategy => update({ strategy }, "strategy"),
        setBroker: broker => update({ broker }, "broker"),
        setAccount: account => update({ account }, "account"),
        setLayout: layout => update({ layout }, "layout"),
        setWorkspace: workspace => update({ workspace }, "workspace"),
        setWatchlist: watchlist => update({ watchlist }, "watchlist"),
        setLifecycle: lifecycle => update({ lifecycle }, "lifecycle"),
        setSelectedOpportunity
    };
})();
