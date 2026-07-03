/*
Version 77.0 — Dock State Inspector
*/
(function () {
    const VERSION = "77.0";

    function render() {
        const panel = document.getElementById("dockStateInspectorPanelV77");
        if (!panel) return;

        const snap = window.NativeDockingManagerV77?.snapshot?.() || { panels: [], state: {} };
        const panels = snap.panels || [];

        panel.innerHTML = `
            <section class="v77-card">
                <div class="v77-header">
                    <div>
                        <h2>Dock State Inspector</h2>
                        <span>${panels.length} panels · layout diagnostics</span>
                    </div>
                    <strong>V77</strong>
                </div>

                <div class="v77-panel-list">
                    ${panels.slice(0, 20).map(p => `
                        <div class="${p.floating ? "floating" : "docked"}">
                            <b>${p.title}</b>
                            <span>${p.dock}</span>
                            <em>${p.floating ? "floating" : "docked"}</em>
                        </div>
                    `).join("") || "<div class='v77-empty'>No panels discovered.</div>"}
                </div>
            </section>
        `;
    }

    function wire() {
        window.EventBus?.subscribe?.("panel-registry-v77.updated", render);
        window.EventBus?.subscribe?.("native-docking-v77.updated", render);
        setTimeout(render, 2200);
    }

    window.DockStateInspectorV77 = { render, version: VERSION };
    document.addEventListener("DOMContentLoaded", () => setTimeout(wire, 1600));
})();
