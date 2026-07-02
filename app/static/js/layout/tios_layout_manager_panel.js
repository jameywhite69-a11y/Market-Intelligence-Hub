/*
Version 50.0 — Layout Manager Panel
Shows registered panels and missing panels for diagnostics.
*/
(function () {
    function renderLayoutManagerPanel() {
        const panel = document.getElementById("tiosLayoutManagerPanel");
        if (!panel) return;

        const panels = window.TIOSPanelRegistry?.all?.() || [];
        const rows = panels.map(p => {
            const exists = p.id === "workstationResultsPanel"
                ? !!document.querySelector(".workstation-results-panel")
                : !!document.getElementById(p.id);

            return `
                <div class="tios-layout-row ${exists ? "ok" : "missing"}">
                    <b>${p.title || p.id}</b>
                    <span>${p.region} · ${p.id}</span>
                    <em>${exists ? "OK" : "Missing"}</em>
                </div>
            `;
        }).join("");

        panel.innerHTML = `
            <section class="tios-layout-manager-card">
                <div class="terminal-card-header">
                    <h3>TIOS Layout Manager</h3>
                    <span>${panels.length} registered</span>
                </div>
                <div class="tios-layout-list">${rows}</div>
                <button id="rerenderTIOSLayoutButton" class="secondary-button">Re-render Layout</button>
                <button id="resetTIOSRegistryButton" class="secondary-button">Reset Registry</button>
            </section>
        `;

        document.getElementById("rerenderTIOSLayoutButton")?.addEventListener("click", () => {
            window.TIOSLayoutManager?.render?.();
            renderLayoutManagerPanel();
        });

        document.getElementById("resetTIOSRegistryButton")?.addEventListener("click", () => {
            window.TIOSPanelRegistry?.reset?.();
            window.TIOSLayoutManager?.render?.();
            renderLayoutManagerPanel();
        });
    }

    window.EventBus?.subscribe?.("layout.rendered", renderLayoutManagerPanel);
    window.EventBus?.subscribe?.("layout.panel.registered", renderLayoutManagerPanel);
    document.addEventListener("DOMContentLoaded", () => setTimeout(renderLayoutManagerPanel, 1800));

    window.TIOSLayoutManagerPanel = { renderLayoutManagerPanel };
})();
