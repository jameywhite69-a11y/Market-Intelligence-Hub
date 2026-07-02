/*
Version 51.1 — Startup Trace Panel
Developer panel for startup/layout diagnostics.
*/
(function () {
    function escapeHtml(text) {
        return String(text || "").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
    }

    function renderStartupTracePanel() {
        const panel = document.getElementById("startupTracePanel");
        if (!panel) return;

        const report = window.TIOSStartupTrace?.report?.() || { rows: [], panels: [] };
        const recent = (report.rows || []).slice(-80).reverse();
        const panels = (report.panels || []).map(p => `
            <div class="startup-trace-panel-row ${p.exists ? "ok" : "missing"}">
                <b>${p.id}</b>
                <span>${p.parent}</span>
                <em>${p.layoutRegion || p.docked || ""}</em>
            </div>
        `).join("");

        panel.innerHTML = `
            <section class="startup-trace-card">
                <div class="terminal-card-header">
                    <h3>Startup Trace</h3>
                    <span>${recent.length} recent</span>
                </div>

                <div class="startup-trace-actions">
                    <button id="refreshStartupTraceButton" class="secondary-button">Refresh</button>
                    <button id="exportStartupTraceButton" class="secondary-button">Export JSON</button>
                </div>

                <h4>Panel Ownership</h4>
                <div class="startup-trace-panel-list">${panels}</div>

                <h4>Recent Events</h4>
                <div class="startup-trace-list">
                    ${recent.map(row => `
                        <div class="startup-trace-row">
                            <b>${row.t} ms · ${row.type}</b>
                            <span>${escapeHtml(JSON.stringify(row.detail || {}).slice(0, 220))}</span>
                        </div>
                    `).join("")}
                </div>
            </section>
        `;

        document.getElementById("refreshStartupTraceButton")?.addEventListener("click", renderStartupTracePanel);
        document.getElementById("exportStartupTraceButton")?.addEventListener("click", () => window.TIOSStartupTrace?.exportJson?.());
    }

    document.addEventListener("DOMContentLoaded", () => {
        setTimeout(renderStartupTracePanel, 1800);
        setInterval(renderStartupTracePanel, 4000);
    });

    window.StartupTracePanel = { renderStartupTracePanel };
})();
