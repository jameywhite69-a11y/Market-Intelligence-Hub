/*
Version 51.2 — Startup Ownership Panel
*/
(function () {
    function esc(text) {
        return String(text || "").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
    }

    function renderStartupOwnershipPanel() {
        const panel = document.getElementById("startupOwnershipPanel");
        if (!panel) return;

        const analyzer = window.TIOSStartupOwnershipAnalyzer;
        const report = analyzer?.report?.() || { rows: [], panels: [], modules: [], conflicts: {} };
        const managed = report.conflicts?.managedPanels || [];
        const missing = report.conflicts?.missingPanels || [];

        panel.innerHTML = `
            <section class="ownership-card">
                <div class="terminal-card-header">
                    <h3>Startup Ownership Analyzer</h3>
                    <span>${report.rows?.length || 0} events</span>
                </div>

                <div class="ownership-summary-grid">
                    <div><b>Managed Panels</b><span>${managed.length}</span></div>
                    <div><b>Missing Watched</b><span>${missing.length}</span></div>
                    <div><b>Layout Manager</b><span>${report.bodyDataset?.tiosLayoutManager || "none"}</span></div>
                    <div><b>Runtime Composer</b><span>${report.bodyDataset?.runtimeLayoutComposer || "none"}</span></div>
                </div>

                <div class="ownership-actions">
                    <button id="refreshStartupOwnershipButton" class="secondary-button">Refresh</button>
                    <button id="exportStartupOwnershipButton" class="secondary-button">Export JSON</button>
                </div>

                <h4>Panel Ownership</h4>
                <div class="ownership-list">
                    ${(report.panels || []).map(p => `
                        <div class="ownership-panel-row ${p.exists ? "ok" : "missing"}">
                            <b>${p.id}</b>
                            <span>${p.parent}</span>
                            <em>${p.layoutRegion || p.docked || (p.exists ? "found" : "missing")}</em>
                        </div>
                    `).join("")}
                </div>

                <h4>Module Globals</h4>
                <div class="ownership-module-list">
                    ${(report.modules || []).map(m => `
                        <div class="ownership-module-row ${m.present ? "ok" : "missing"}">
                            <b>${m.name}</b>
                            <span>${m.type}</span>
                        </div>
                    `).join("")}
                </div>

                <h4>Recent Ownership Events</h4>
                <div class="ownership-event-list">
                    ${(report.rows || []).slice(-100).reverse().map(row => `
                        <div class="ownership-event-row">
                            <b>${row.t} ms · ${row.type}</b>
                            <span>${esc(JSON.stringify(row.detail || {}).slice(0, 280))}</span>
                            ${row.stack ? `<pre>${esc(row.stack.slice(0, 800))}</pre>` : ""}
                        </div>
                    `).join("")}
                </div>
            </section>
        `;

        document.getElementById("refreshStartupOwnershipButton")?.addEventListener("click", renderStartupOwnershipPanel);
        document.getElementById("exportStartupOwnershipButton")?.addEventListener("click", () => analyzer?.exportJson?.());
    }

    document.addEventListener("DOMContentLoaded", () => {
        setTimeout(renderStartupOwnershipPanel, 1800);
        setInterval(renderStartupOwnershipPanel, 5000);
    });

    window.StartupOwnershipPanel = { renderStartupOwnershipPanel };
})();
