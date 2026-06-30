(function () {
    function scoreReadiness() {
        const modules = window.ModuleRegistry?.summary?.() || { total: 0, healthy: 0, failed: 0 };
        const context = window.WorkspaceContext?.snapshot?.() || {};
        const hasContext = !!context.updatedAt;
        const hasSelection = !!context.selectedOpportunity;
        const moduleScore = modules.total ? (modules.healthy / modules.total) * 40 : 0;
        const contextScore = hasContext ? 20 : 0;
        const selectionScore = hasSelection ? 10 : 0;
        const diagnosticsScore = modules.failed === 0 ? 20 : 0;
        const persistenceScore = window.WorkspaceProfiles ? 10 : 0;

        return Math.round(moduleScore + contextScore + selectionScore + diagnosticsScore + persistenceScore);
    }

    function renderCommercialReadinessPanel() {
        const panel = document.getElementById("commercialReadinessPanel");
        if (!panel) return;

        const score = scoreReadiness();
        const modules = window.ModuleRegistry?.summary?.() || { total: 0, healthy: 0, failed: 0 };

        panel.innerHTML = `
            <section class="commercial-readiness-card">
                <div class="terminal-card-header">
                    <h3>Commercial Readiness</h3>
                    <span>${score}%</span>
                </div>

                <div class="commercial-readiness-meter">
                    <div style="width:${Math.min(100, score)}%"></div>
                </div>

                <div class="commercial-readiness-grid">
                    <div><b>Modules</b><span>${modules.healthy}/${modules.total}</span></div>
                    <div><b>Failures</b><span>${modules.failed}</span></div>
                    <div><b>Context</b><span>${window.WorkspaceContext ? "Ready" : "Missing"}</span></div>
                    <div><b>Persistence</b><span>${window.WorkspaceProfiles ? "Ready" : "Missing"}</span></div>
                </div>
            </section>
        `;
    }

    window.EventBus?.subscribe?.("mih.ready", renderCommercialReadinessPanel);
    window.EventBus?.subscribe?.("module.status.changed", renderCommercialReadinessPanel);
    window.EventBus?.subscribe?.("workspace.context.changed", renderCommercialReadinessPanel);
    document.addEventListener("DOMContentLoaded", () => setTimeout(renderCommercialReadinessPanel, 900));

    window.CommercialReadinessPanel = {
        renderCommercialReadinessPanel,
    };
})();
