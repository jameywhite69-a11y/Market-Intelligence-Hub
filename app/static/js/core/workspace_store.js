(function () {
    const state = {
        scannerResults: [],
        filteredResults: [],
        selectedOpportunity: null,
        watchlists: [],
        diagnostics: null,
        executionSnapshot: null,
        portfolioSnapshot: null,
        lastScan: null,
        errors: [],
    };

    function get(key) { return state[key]; }

    function set(key, value) {
        state[key] = value;
        window.EventBus?.publish(`store:${key}:changed`, { key, value });
        window.EventBus?.publish("store:changed", { key, value });
        return value;
    }

    function merge(key, patch) {
        return set(key, { ...(state[key] || {}), ...patch });
    }

    function pushError(error, source = "unknown") {
        const record = {
            source,
            message: error?.message || String(error),
            time: new Date().toISOString(),
        };
        state.errors.push(record);
        if (state.errors.length > 100) state.errors.shift();
        window.EventBus?.publish("store:error", record);
        return record;
    }

    function snapshot() {
        return JSON.parse(JSON.stringify(state));
    }

    window.WorkspaceStore = { get, set, merge, pushError, snapshot, state };
})();
