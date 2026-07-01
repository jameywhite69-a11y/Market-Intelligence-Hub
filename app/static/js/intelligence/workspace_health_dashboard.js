(function () {
    function healthRows() {
        return [
            ["Event Bus", !!window.EventBus],
            ["Workspace Store", !!window.WorkspaceStore],
            ["Workspace Context", !!window.WorkspaceContext],
            ["Dock System", !!window.InstitutionalDockSystem],
            ["Unified Opportunity", !!window.UnifiedOpportunityStore],
            ["Sync Engine", !!window.WorkspaceSynchronizationEngine],
            ["Event Recorder", !!window.GlobalEventRecorder],
            ["AI Client", !!window.aiDecisionClient],
            ["Risk Client", !!window.institutionalRiskClient],
            ["Portfolio Client", !!window.portfolioIntelligenceClient],
            ["Command Center", !!window.CommandCenterStore],
            ["Strategy Registry", !!window.strategyRegistryClient],
        ];
    }

    function renderWorkspaceHealthDashboard() {
        const panel = document.getElementById("workspaceHealthDashboardPanel");
        if (!panel) return;

        const rows = healthRows();
        const healthy = rows.filter(row => row[1]).length;

        panel.innerHTML = `
            <section class="workspace-health-card">
                <div class="terminal-card-header">
                    <h3>Workspace Health</h3>
                    <span>${healthy}/${rows.length} healthy</span>
                </div>

                <div class="workspace-health-grid">
                    ${rows.map(row => `
                        <div class="workspace-health-row ${row[1] ? "ok" : "fail"}">
                            <b>${row[0]}</b>
                            <span>${row[1] ? "Ready" : "Missing"}</span>
                        </div>
                    `).join("")}
                </div>

                <div class="event-recorder-list">
                    ${(window.GlobalEventRecorder?.list?.(8) || []).map(event => `
                        <div class="event-recorder-row">
                            <b>${event.type}</b>
                            <span>${new Date(event.timestamp).toLocaleTimeString()}</span>
                        </div>
                    `).join("") || `<p class="muted">No recorded events yet.</p>`}
                </div>
            </section>
        `;
    }

    window.EventBus?.subscribe?.("event-recorder.updated", renderWorkspaceHealthDashboard);
    window.EventBus?.subscribe?.("platform.validation", renderWorkspaceHealthDashboard);
    window.EventBus?.subscribe?.("unified-opportunity.changed", renderWorkspaceHealthDashboard);
    document.addEventListener("DOMContentLoaded", () => setTimeout(renderWorkspaceHealthDashboard, 1200));

    window.WorkspaceHealthDashboard = {
        renderWorkspaceHealthDashboard,
    };
})();
