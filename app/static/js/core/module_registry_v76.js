/*
Version 76.0 — Module Registry & Lifecycle Manager
Purpose:
- Register platform modules with ids, versions, dependencies, and status.
- Provide startup/lifecycle diagnostics without replacing existing modules yet.
- No broker execution.
*/
(function () {
    const VERSION = "76.0";

    const REGISTRY = {
        modules: new Map(),
        events: []
    };

    function now() {
        return new Date().toLocaleTimeString();
    }

    function log(message, data) {
        REGISTRY.events.unshift({ time: now(), message, data: data || {} });
        REGISTRY.events = REGISTRY.events.slice(0, 100);
    }

    function register(config) {
        if (!config || !config.id) return false;

        const record = {
            id: config.id,
            label: config.label || config.id,
            version: config.version || "unknown",
            dependencies: config.dependencies || [],
            global: config.global || null,
            status: "registered",
            initialized: false,
            lastError: null,
            init: typeof config.init === "function" ? config.init : null
        };

        REGISTRY.modules.set(record.id, record);
        log(`Registered module: ${record.id}`, record);
        publish();
        return record;
    }

    function dependencyStatus(record) {
        return (record.dependencies || []).map(dep => ({
            id: dep,
            ok: REGISTRY.modules.has(dep) || !!window[dep]
        }));
    }

    function initModule(id) {
        const record = REGISTRY.modules.get(id);
        if (!record) return null;

        const deps = dependencyStatus(record);
        const missing = deps.filter(d => !d.ok);

        if (missing.length) {
            record.status = "waiting";
            record.lastError = `Missing dependencies: ${missing.map(x => x.id).join(", ")}`;
            log(`Module waiting: ${id}`, { missing });
            publish();
            return record;
        }

        try {
            if (record.init && !record.initialized) {
                record.init();
            }
            record.initialized = true;
            record.status = "ready";
            record.lastError = null;
            log(`Module ready: ${id}`, record);
        } catch (err) {
            record.status = "error";
            record.lastError = String(err.message || err);
            log(`Module error: ${id}`, { error: record.lastError });
        }

        publish();
        return record;
    }

    function initAll() {
        Array.from(REGISTRY.modules.keys()).forEach(initModule);
        render();
    }

    function autoDiscover() {
        const discovered = [
            ["event-bus", "Event Bus", "EventBus"],
            ["core-dispatcher", "Core Event Dispatcher", "CoreEventDispatcherV75"],
            ["context-store", "Market Context Store", "MarketContextStoreV63"],
            ["settings", "Unified Settings", "UnifiedSettingsStoreV73"],
            ["realtime", "Realtime Data Bus", "RealtimeDataBusV74"],
            ["portfolio", "Portfolio Store", "PortfolioIntelligenceStoreV64"],
            ["execution-service", "Execution Service", "ExecutionServiceV65"],
            ["live-orders", "Live Order Manager", "LiveOrderManagerV66"],
            ["analytics", "Performance Analytics", "PerformanceAnalyticsEngineV67"],
            ["automation", "Workflow Automation", "WorkflowAutomationEngineV69"],
            ["workspace-persistence", "Workspace Persistence", "WorkspacePersistenceManagerV72"]
        ];

        discovered.forEach(([id, label, global]) => {
            if (!REGISTRY.modules.has(id)) {
                register({
                    id,
                    label,
                    version: window[global]?.version || "detected",
                    global,
                    dependencies: [],
                    init: null
                });
            }

            const rec = REGISTRY.modules.get(id);
            rec.status = window[global] ? "ready" : "missing";
            rec.initialized = !!window[global];
        });

        log("Auto-discovery complete");
        publish();
        render();
    }

    function snapshot() {
        const modules = Array.from(REGISTRY.modules.values()).map(m => ({
            id: m.id,
            label: m.label,
            version: m.version,
            dependencies: m.dependencies,
            global: m.global,
            status: m.status,
            initialized: m.initialized,
            lastError: m.lastError
        }));

        return {
            version: VERSION,
            modules,
            events: REGISTRY.events.slice(),
            counts: {
                total: modules.length,
                ready: modules.filter(m => m.status === "ready").length,
                waiting: modules.filter(m => m.status === "waiting").length,
                missing: modules.filter(m => m.status === "missing").length,
                error: modules.filter(m => m.status === "error").length
            }
        };
    }

    function publish() {
        window.EventBus?.publish?.("module-registry-v76.updated", snapshot());
    }

    function render() {
        const panel = document.getElementById("moduleRegistryPanelV76");
        if (!panel) return;

        const snap = snapshot();

        panel.innerHTML = `
            <section class="v76-card">
                <div class="v76-header">
                    <div>
                        <h2>Module Registry V76</h2>
                        <span>lifecycle and dependency visibility</span>
                    </div>
                    <strong>${snap.counts.ready}/${snap.counts.total} READY</strong>
                </div>

                <div class="v76-grid">
                    <div><small>Total</small><b>${snap.counts.total}</b></div>
                    <div><small>Ready</small><b>${snap.counts.ready}</b></div>
                    <div><small>Waiting</small><b>${snap.counts.waiting}</b></div>
                    <div><small>Missing</small><b>${snap.counts.missing}</b></div>
                    <div><small>Errors</small><b>${snap.counts.error}</b></div>
                    <div><small>Version</small><b>${VERSION}</b></div>
                </div>

                <div class="v76-actions">
                    <button id="v76DiscoverModules">Discover Modules</button>
                    <button id="v76InitModules">Initialize Registered</button>
                </div>
            </section>
        `;

        document.getElementById("v76DiscoverModules")?.addEventListener("click", autoDiscover);
        document.getElementById("v76InitModules")?.addEventListener("click", initAll);
    }

    function init() {
        autoDiscover();
        render();
        document.body.dataset.moduleRegistryV76 = VERSION;
    }

    window.ModuleRegistryV76 = {
        register,
        initModule,
        initAll,
        autoDiscover,
        snapshot,
        render,
        version: VERSION
    };

    document.addEventListener("DOMContentLoaded", () => setTimeout(init, 1200));
})();
