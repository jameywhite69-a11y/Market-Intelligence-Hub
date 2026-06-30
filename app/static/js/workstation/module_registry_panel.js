(function () {
    function renderModuleRegistryPanel() {
        const panel = document.getElementById("moduleRegistryPanel");
        if (!panel) return;
        const summary = window.ModuleRegistry?.summary?.() || { total: 0, healthy: 0, failed: 0, rows: [] };
        panel.innerHTML = `
            <section class="module-registry-card">
                <div class="terminal-card-header"><h3>Module Registry</h3><span>${summary.healthy}/${summary.total} healthy</span></div>
                <div class="module-registry-list">
                    ${summary.rows.map(row => `<div class="module-registry-row ${row.health}"><b>${row.name}</b><span>${row.status}</span></div>`).join("") || `<p class="muted">No modules registered.</p>`}
                </div>
            </section>`;
    }
    window.EventBus?.subscribe?.("module.registered", renderModuleRegistryPanel);
    window.EventBus?.subscribe?.("module.status.changed", renderModuleRegistryPanel);
    window.EventBus?.subscribe?.("mih.ready", renderModuleRegistryPanel);
    document.addEventListener("DOMContentLoaded", () => setTimeout(renderModuleRegistryPanel, 350));
    window.ModuleRegistryPanel = { renderModuleRegistryPanel };
})();
