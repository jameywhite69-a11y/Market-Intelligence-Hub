/*
Version 72.0 — Workspace Persistence Manager
Purpose:
- Save/restore workspace UI preferences locally.
- Track collapsed panels, production view, active dock tab, and layout profile.
- Local browser storage only. No broker execution.
*/
(function () {
    const VERSION = "72.0";
    const KEY = "mih.tios.workspace.persistence.v72";

    const defaults = {
        profile: "Institutional Default",
        activeDock: "execution",
        productionMode: true,
        compactPanels: false,
        collapsedPanels: {},
        lastSaved: null
    };

    function load() {
        try {
            return { ...defaults, ...(JSON.parse(localStorage.getItem(KEY)) || {}) };
        } catch {
            return { ...defaults };
        }
    }

    function save(next) {
        const state = { ...load(), ...next, lastSaved: new Date().toISOString() };
        localStorage.setItem(KEY, JSON.stringify(state));
        window.EventBus?.publish?.("workspace-persistence.updated", state);
        apply(state);
        render();
        return state;
    }

    function reset() {
        localStorage.removeItem(KEY);
        apply(defaults);
        render();
    }

    function apply(state = load()) {
        document.body.dataset.workspacePersistence = VERSION;
        document.body.dataset.workspaceProfile = state.profile;
        document.body.dataset.workspaceCompactPanels = state.compactPanels ? "true" : "false";
        document.body.dataset.productionMode = state.productionMode ? "true" : "false";

        document.querySelectorAll("[data-dock-tab]").forEach(tab => {
            tab.classList.toggle("active", tab.dataset.dockTab === state.activeDock);
        });

        document.querySelectorAll("[data-dock-panel]").forEach(panel => {
            panel.classList.toggle("active", panel.dataset.dockPanel === state.activeDock);
        });

        Object.entries(state.collapsedPanels || {}).forEach(([id, collapsed]) => {
            const el = document.getElementById(id);
            if (el) el.dataset.v72Collapsed = collapsed ? "true" : "false";
        });
    }

    function capture() {
        const activeDock =
            document.querySelector("[data-dock-tab].active")?.dataset?.dockTab ||
            document.querySelector("[data-dock-panel].active")?.dataset?.dockPanel ||
            load().activeDock;

        const collapsedPanels = {};
        document.querySelectorAll("[id][data-v72-collapsible='true']").forEach(el => {
            collapsedPanels[el.id] = el.dataset.v72Collapsed === "true";
        });

        return save({ activeDock, collapsedPanels });
    }

    function wireDockTabs() {
        document.querySelectorAll("[data-dock-tab]").forEach(tab => {
            if (tab.dataset.v72Wired === "true") return;
            tab.dataset.v72Wired = "true";
            tab.addEventListener("click", () => {
                save({ activeDock: tab.dataset.dockTab });
            }, true);
        });
    }

    function render() {
        const panel = document.getElementById("workspacePersistencePanelV72");
        if (!panel) return;

        const state = load();

        panel.innerHTML = `
            <section class="v72-card">
                <div class="v72-header">
                    <div>
                        <h2>Workspace Persistence Manager</h2>
                        <span>local layout and preference restore</span>
                    </div>
                    <strong>${state.profile}</strong>
                </div>

                <div class="v72-grid">
                    <div><small>Active Dock</small><b>${state.activeDock}</b></div>
                    <div><small>Production</small><b>${state.productionMode ? "on" : "off"}</b></div>
                    <div><small>Compact</small><b>${state.compactPanels ? "on" : "off"}</b></div>
                    <div><small>Last Saved</small><b>${state.lastSaved ? new Date(state.lastSaved).toLocaleTimeString() : "—"}</b></div>
                </div>

                <div class="v72-actions">
                    <button id="v72SaveWorkspace">Save Current Workspace</button>
                    <button id="v72ToggleProduction">Toggle Production View</button>
                    <button id="v72ToggleCompact">Toggle Compact Panels</button>
                    <button id="v72ResetWorkspace">Reset Workspace</button>
                </div>
            </section>
        `;

        document.getElementById("v72SaveWorkspace")?.addEventListener("click", capture);
        document.getElementById("v72ToggleProduction")?.addEventListener("click", () => save({ productionMode: !load().productionMode }));
        document.getElementById("v72ToggleCompact")?.addEventListener("click", () => save({ compactPanels: !load().compactPanels }));
        document.getElementById("v72ResetWorkspace")?.addEventListener("click", reset);
    }

    function init() {
        wireDockTabs();
        apply(load());
        render();
        setInterval(wireDockTabs, 1500);
    }

    window.WorkspacePersistenceManagerV72 = {
        load,
        save,
        reset,
        apply,
        capture,
        render,
        version: VERSION
    };

    document.addEventListener("DOMContentLoaded", () => setTimeout(init, 1000));
})();
