/*
Version 77.0 — Panel Registry
Registers workstation panels for docking, floating, layout restore, and diagnostics.
No broker execution.
*/
(function () {
    const VERSION = "77.0";
    const PANELS = new Map();

    const DEFAULT_PANELS = [
        ["opportunityHeatmap", "Opportunity Heat Map", "center"],
        ["marketRegimeEnginePanel", "Market Regime", "center"],
        ["institutionalMarketContextPanel", "Institutional Market Context", "center"],
        ["aiCommanderPanel", "AI Commander", "right"],
        ["institutionalTradeEnginePanel", "Trade Engine", "center"],
        ["executionWorkflowEnginePanel", "Execution Workflow", "center"],
        ["portfolioHealthDashboardV64Panel", "Portfolio Health", "center"],
        ["performanceDashboardV67Panel", "Performance Analytics", "center"],
        ["workflowAutomationEnginePanelV69", "Workflow Automation", "center"],
        ["releaseCandidateDashboardV70Panel", "Release Candidate", "center"],
        ["moduleRegistryPanelV76", "Module Registry", "bottom"]
    ];

    function register(config) {
        if (!config || !config.id) return null;

        const existing = PANELS.get(config.id) || {};
        const panel = {
            id: config.id,
            title: config.title || existing.title || config.id,
            dock: config.dock || existing.dock || "center",
            minWidth: config.minWidth || 280,
            minHeight: config.minHeight || 160,
            detachable: config.detachable !== false,
            resizable: config.resizable !== false,
            visible: config.visible !== false,
            floating: false,
            x: 120,
            y: 120,
            width: 520,
            height: 360,
            ...existing,
            ...config
        };

        PANELS.set(panel.id, panel);
        window.EventBus?.publish?.("panel-registry-v77.updated", snapshot());
        return panel;
    }

    function autoDiscover() {
        DEFAULT_PANELS.forEach(([id, title, dock]) => {
            const el = document.getElementById(id);
            if (el) {
                register({ id, title, dock });
                el.dataset.v77Panel = "true";
                el.dataset.v77Dock = dock;
            }
        });

        document.querySelectorAll(".desk-panel[id], section[id]").forEach(el => {
            if (!PANELS.has(el.id) && /Panel|Heatmap|Dashboard|Engine|Queue|Console|Manager/i.test(el.id)) {
                register({
                    id: el.id,
                    title: el.id.replace(/([A-Z])/g, " $1").replace(/Panel|V\d+/g, "").trim(),
                    dock: "center"
                });
                el.dataset.v77Panel = "true";
            }
        });

        return snapshot();
    }

    function get(id) {
        return PANELS.get(id);
    }

    function list() {
        return Array.from(PANELS.values());
    }

    function update(id, patch) {
        const panel = PANELS.get(id);
        if (!panel) return null;
        const next = { ...panel, ...patch };
        PANELS.set(id, next);
        window.EventBus?.publish?.("panel-registry-v77.updated", snapshot());
        return next;
    }

    function snapshot() {
        return {
            version: VERSION,
            panels: list(),
            count: PANELS.size
        };
    }

    function init() {
        autoDiscover();
        document.body.dataset.panelRegistryV77 = VERSION;
        console.log("[PanelRegistryV77]", snapshot());
    }

    window.PanelRegistryV77 = {
        register,
        autoDiscover,
        get,
        list,
        update,
        snapshot,
        version: VERSION
    };

    document.addEventListener("DOMContentLoaded", () => setTimeout(init, 1000));
})();
