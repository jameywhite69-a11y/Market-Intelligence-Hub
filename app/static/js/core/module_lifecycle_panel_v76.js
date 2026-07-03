/*
Version 76.0 — Module Lifecycle Panel
Shows registered modules and status.
*/
(function () {
    const VERSION = "76.0";

    function render(snapshot) {
        const panel = document.getElementById("moduleLifecyclePanelV76");
        if (!panel) return;

        const snap = snapshot || window.ModuleRegistryV76?.snapshot?.() || { modules: [] };

        panel.innerHTML = `
            <section class="v76-card">
                <div class="v76-header">
                    <div>
                        <h2>Module Lifecycle</h2>
                        <span>${snap.modules.length} registered modules</span>
                    </div>
                    <strong>REGISTRY</strong>
                </div>

                <div class="v76-module-list">
                    ${snap.modules.map(m => `
                        <div class="${m.status}">
                            <b>${m.label}</b>
                            <span>${m.version}</span>
                            <em>${m.status}</em>
                        </div>
                    `).join("") || "<div class='v76-empty'>No modules discovered yet.</div>"}
                </div>
            </section>
        `;
    }

    function wire() {
        window.EventBus?.subscribe?.("module-registry-v76.updated", render);
        setTimeout(() => render(), 1800);
    }

    window.ModuleLifecyclePanelV76 = { render, version: VERSION };
    document.addEventListener("DOMContentLoaded", () => setTimeout(wire, 1400));
})();
