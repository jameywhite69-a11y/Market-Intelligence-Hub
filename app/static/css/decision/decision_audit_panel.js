(function () {
    function renderDecisionAuditPanel() {
        const panel = document.getElementById("decisionAuditTrailPanel");
        if (!panel) return;

        const rows = window.DecisionAuditTrail?.list?.(20) || [];

        panel.innerHTML = `
            <section class="decision-audit-card">
                <div class="terminal-card-header">
                    <h3>Decision Audit Trail</h3>
                    <span>${rows.length} recent</span>
                </div>

                <div class="decision-audit-list">
                    ${rows.map(row => `
                        <div class="decision-audit-row">
                            <b>${row.stage}</b>
                            <span>${row.symbol || "—"} ${row.timeframe || ""}</span>
                            <small>${row.recommendation || ""} ${row.score ? `· ${row.score}` : ""}</small>
                            <em>${new Date(row.timestamp).toLocaleTimeString()}</em>
                        </div>
                    `).join("") || `<p class="muted">No decision audit events yet.</p>`}
                </div>

                <button id="clearDecisionAuditButton" class="secondary-button">Clear Audit</button>
            </section>
        `;

        document.getElementById("clearDecisionAuditButton")?.addEventListener("click", () => {
            window.DecisionAuditTrail?.clear?.();
            renderDecisionAuditPanel();
        });
    }

    window.EventBus?.subscribe?.("decision-audit.updated", renderDecisionAuditPanel);
    window.EventBus?.subscribe?.("decision-audit.cleared", renderDecisionAuditPanel);
    document.addEventListener("DOMContentLoaded", () => setTimeout(renderDecisionAuditPanel, 1400));

    window.DecisionAuditPanel = {
        renderDecisionAuditPanel
    };
})();
