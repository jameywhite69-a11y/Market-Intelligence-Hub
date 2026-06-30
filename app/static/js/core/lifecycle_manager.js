(function () {
    const lifecycle = { phases: [], startedAt: null, readyAt: null };
    function record(phase, details = {}) {
        const item = { phase, details, timestamp: new Date().toISOString() };
        lifecycle.phases.push(item);
        if (lifecycle.phases.length > 200) lifecycle.phases.shift();
        window.EventBus?.publish?.("lifecycle.phase", item);
        return item;
    }
    function registerKnownModules() {
        const modules = [
            ["scanner","Scanner Engine","trading"],["watchlists","Watchlist Manager","trading"],
            ["execution","Execution Center","trading"],["broker-adapter","Broker Adapter","trading"],
            ["strategy-execution","Strategy Execution","strategy"],["positions","Position Management","risk"],
            ["portfolio-risk","Portfolio Risk","risk"],["market-data","Live Market Data","market"],
            ["workflow","Workflow Engine","core"],["ai-decision","AI Decision Center","ai"],
            ["dock-system","Institutional Dock","workspace"],["diagnostics","Diagnostics","core"]
        ];
        for (const [id, name, category] of modules) window.ModuleRegistry?.register?.({ id, name, category, version: "42.1", status: "ready", health: "healthy" });
    }
    async function start() {
        lifecycle.startedAt = new Date().toISOString();
        record("initialize"); window.WorkspaceContext?.restore?.();
        record("load-settings"); record("register-modules"); registerKnownModules();
        record("subscribe"); record("ready");
        lifecycle.readyAt = new Date().toISOString();
        window.EventBus?.publish?.("mih.ready", snapshot());
        return snapshot();
    }
    function snapshot() { return { startedAt: lifecycle.startedAt, readyAt: lifecycle.readyAt, phases: lifecycle.phases.slice() }; }
    document.addEventListener("DOMContentLoaded", () => setTimeout(start, 50));
    window.LifecycleManager = { start, record, snapshot };
})();
