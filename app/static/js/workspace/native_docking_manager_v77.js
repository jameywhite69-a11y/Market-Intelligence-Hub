/*
Version 77.0 — Native Docking Manager
Adds dock zones, panel toolbar controls, floating mode, and local layout restore.
No broker execution.
*/
(function () {
    const VERSION = "77.0";
    const KEY = "mih.tios.native.docking.v77";

    function load() {
        try {
            return JSON.parse(localStorage.getItem(KEY)) || { panels: {}, activeLayout: "Institutional Default" };
        } catch {
            return { panels: {}, activeLayout: "Institutional Default" };
        }
    }

    function save(state) {
        localStorage.setItem(KEY, JSON.stringify(state));
        window.EventBus?.publish?.("native-docking-v77.updated", snapshot());
        return state;
    }

    function snapshot() {
        return {
            version: VERSION,
            state: load(),
            panels: window.PanelRegistryV77?.list?.() || []
        };
    }

    function ensureToolbar(el, panel) {
        if (!el || el.querySelector(":scope > .v77-panel-toolbar")) return;

        const bar = document.createElement("div");
        bar.className = "v77-panel-toolbar";
        bar.innerHTML = `
            <b>${panel.title}</b>
            <span>
                <button data-v77-action="float">Float</button>
                <button data-v77-action="dock">Dock</button>
                <button data-v77-action="collapse">Collapse</button>
            </span>
        `;

        el.insertBefore(bar, el.firstChild);

        bar.querySelector("[data-v77-action='float']")?.addEventListener("click", e => {
            e.stopPropagation();
            floatPanel(panel.id);
        });

        bar.querySelector("[data-v77-action='dock']")?.addEventListener("click", e => {
            e.stopPropagation();
            dockPanel(panel.id);
        });

        bar.querySelector("[data-v77-action='collapse']")?.addEventListener("click", e => {
            e.stopPropagation();
            toggleCollapse(panel.id);
        });
    }

    function decoratePanels() {
        const panels = window.PanelRegistryV77?.list?.() || [];
        panels.forEach(panel => {
            const el = document.getElementById(panel.id);
            if (!el) return;
            el.dataset.v77Panel = "true";
            el.dataset.v77Floating = panel.floating ? "true" : "false";
            el.dataset.v77Collapsed = el.dataset.v77Collapsed || "false";
            ensureToolbar(el, panel);
        });
    }

    function floatPanel(id) {
        const panel = window.PanelRegistryV77?.get?.(id);
        const el = document.getElementById(id);
        if (!panel || !el) return;

        const state = load();
        const saved = state.panels[id] || panel;

        el.dataset.v77Floating = "true";
        el.style.position = "fixed";
        el.style.zIndex = "5000";
        el.style.left = `${saved.x || panel.x}px`;
        el.style.top = `${saved.y || panel.y}px`;
        el.style.width = `${saved.width || panel.width}px`;
        el.style.maxHeight = `${saved.height || panel.height}px`;
        el.style.overflow = "auto";

        makeDraggable(el, id);

        window.PanelRegistryV77.update(id, { floating: true });
        state.panels[id] = { ...(state.panels[id] || {}), floating: true };
        save(state);
    }

    function dockPanel(id) {
        const el = document.getElementById(id);
        if (!el) return;

        el.dataset.v77Floating = "false";
        el.style.position = "";
        el.style.zIndex = "";
        el.style.left = "";
        el.style.top = "";
        el.style.width = "";
        el.style.maxHeight = "";
        el.style.overflow = "";

        window.PanelRegistryV77?.update?.(id, { floating: false });

        const state = load();
        state.panels[id] = { ...(state.panels[id] || {}), floating: false };
        save(state);
    }

    function toggleCollapse(id) {
        const el = document.getElementById(id);
        if (!el) return;

        const collapsed = el.dataset.v77Collapsed === "true";
        el.dataset.v77Collapsed = collapsed ? "false" : "true";

        const state = load();
        state.panels[id] = { ...(state.panels[id] || {}), collapsed: !collapsed };
        save(state);
    }

    function makeDraggable(el, id) {
        if (el.dataset.v77DragWired === "true") return;
        el.dataset.v77DragWired = "true";

        let drag = null;
        const handle = el.querySelector(":scope > .v77-panel-toolbar") || el;

        handle.addEventListener("mousedown", event => {
            if (event.target.closest("button")) return;
            if (el.dataset.v77Floating !== "true") return;

            drag = {
                startX: event.clientX,
                startY: event.clientY,
                left: parseInt(el.style.left || "0", 10),
                top: parseInt(el.style.top || "0", 10)
            };

            event.preventDefault();
        });

        document.addEventListener("mousemove", event => {
            if (!drag) return;
            el.style.left = `${Math.max(0, drag.left + event.clientX - drag.startX)}px`;
            el.style.top = `${Math.max(0, drag.top + event.clientY - drag.startY)}px`;
        });

        document.addEventListener("mouseup", () => {
            if (!drag) return;
            const state = load();
            state.panels[id] = {
                ...(state.panels[id] || {}),
                x: parseInt(el.style.left || "0", 10),
                y: parseInt(el.style.top || "0", 10),
                width: el.offsetWidth,
                height: el.offsetHeight,
                floating: true
            };
            save(state);
            drag = null;
        });
    }

    function restore() {
        const state = load();
        Object.entries(state.panels || {}).forEach(([id, cfg]) => {
            const el = document.getElementById(id);
            if (!el) return;
            if (cfg.collapsed) el.dataset.v77Collapsed = "true";
            if (cfg.floating) floatPanel(id);
        });
    }

    function reset() {
        localStorage.removeItem(KEY);
        (window.PanelRegistryV77?.list?.() || []).forEach(panel => dockPanel(panel.id));
        decoratePanels();
    }

    function render() {
        const panel = document.getElementById("nativeDockingManagerPanelV77");
        if (!panel) return;

        const snap = snapshot();
        const floating = snap.panels.filter(p => p.floating).length;

        panel.innerHTML = `
            <section class="v77-card">
                <div class="v77-header">
                    <div>
                        <h2>Native Docking Manager</h2>
                        <span>floating panels · layout restore · local persistence</span>
                    </div>
                    <strong>${floating} FLOATING</strong>
                </div>

                <div class="v77-grid">
                    <div><small>Registered</small><b>${snap.panels.length}</b></div>
                    <div><small>Floating</small><b>${floating}</b></div>
                    <div><small>Layout</small><b>${snap.state.activeLayout}</b></div>
                    <div><small>Version</small><b>${VERSION}</b></div>
                </div>

                <div class="v77-actions">
                    <button id="v77DiscoverPanels">Discover Panels</button>
                    <button id="v77DecoratePanels">Decorate Panels</button>
                    <button id="v77ResetLayout">Reset Docking</button>
                </div>
            </section>
        `;

        document.getElementById("v77DiscoverPanels")?.addEventListener("click", () => {
            window.PanelRegistryV77?.autoDiscover?.();
            decoratePanels();
            render();
        });

        document.getElementById("v77DecoratePanels")?.addEventListener("click", () => {
            decoratePanels();
            render();
        });

        document.getElementById("v77ResetLayout")?.addEventListener("click", () => {
            reset();
            render();
        });
    }

    function init() {
        setTimeout(() => {
            window.PanelRegistryV77?.autoDiscover?.();
            decoratePanels();
            restore();
            render();
            document.body.dataset.nativeDockingManagerV77 = VERSION;
        }, 600);
    }

    window.NativeDockingManagerV77 = {
        floatPanel,
        dockPanel,
        toggleCollapse,
        decoratePanels,
        restore,
        reset,
        snapshot,
        render,
        version: VERSION
    };

    document.addEventListener("DOMContentLoaded", () => setTimeout(init, 1400));
})();
