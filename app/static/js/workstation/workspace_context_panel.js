(function () {
    function renderWorkspaceContextPanel(payload) {
        const panel = document.getElementById("workspaceContextPanel");
        if (!panel) return;
        const context = payload?.context || window.WorkspaceContext?.snapshot?.() || {};
        const opportunity = context.selectedOpportunity;
        panel.innerHTML = `
            <section class="workspace-context-card">
                <div class="terminal-card-header"><h3>Workspace Context</h3><span>${context.lifecycle || "Idle"}</span></div>
                <div class="workspace-context-grid">
                    <div><b>Symbol</b><span>${context.symbol || "—"}</span></div>
                    <div><b>Timeframe</b><span>${context.timeframe || "—"}</span></div>
                    <div><b>Broker</b><span>${context.broker || "paper"}</span></div>
                    <div><b>Strategy</b><span>${context.strategy || "auto"}</span></div>
                    <div><b>Workspace</b><span>${context.workspace || "professional"}</span></div>
                    <div><b>Layout</b><span>${context.layout || "institutional"}</span></div>
                </div>
                ${opportunity ? `<div class="workspace-context-opportunity"><b>${opportunity.symbol} ${opportunity.timeframe}</b><span>Score ${Number(opportunity.score || 0).toFixed(1)} · ${opportunity.confidence || "Medium"}</span></div>` : `<p class="muted">No opportunity selected.</p>`}
            </section>`;
    }
    window.EventBus?.subscribe?.("workspace.context.changed", renderWorkspaceContextPanel);
    window.EventBus?.subscribe?.("opportunity:selected", () => setTimeout(renderWorkspaceContextPanel, 0));
    document.addEventListener("DOMContentLoaded", () => setTimeout(renderWorkspaceContextPanel, 250));
    window.WorkspaceContextPanel = { renderWorkspaceContextPanel };
})();
