(function () {
    function renderInstitutionalDecisionAuditPanelV48() {
        const panel = document.getElementById("institutionalDecisionAuditPanelV48");
        if (!panel) return;

        const rows = window.InstitutionalDecisionAuditV48?.list?.(20) || [];

        panel.innerHTML = `
            <section class="idp-card">
                <div class="terminal-card-header">
                    <h3>Institutional Audit</h3>
                    <span>${rows.length} recent</span>
                </div>

                <div class="idp-audit-list">
                    ${rows.map(row => `
                        <div class="idp-audit-row">
                            <b>${row.type}</b>
                            <span>${row.symbol || "—"} ${row.score ? `· ${row.score}` : ""}</span>
                            <small>${row.detail || ""}</small>
                        </div>
                    `).join("") || `<p class="muted">No institutional audit entries yet.</p>`}
                </div>
            </section>`;
    }

    window.EventBus?.subscribe?.("institutional-decision-audit.updated", renderInstitutionalDecisionAuditPanelV48);
    document.addEventListener("DOMContentLoaded", () => setTimeout(renderInstitutionalDecisionAuditPanelV48, 2000));

    window.InstitutionalDecisionAuditPanelV48 = {
        renderInstitutionalDecisionAuditPanelV48,
    };
})();
