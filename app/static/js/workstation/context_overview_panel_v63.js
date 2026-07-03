/*
Version 63.0 — Context Overview Panel
Compact unified state overview.
*/
(function () {
    const VERSION = "63.0";

    function render(snapshot) {
        const panel = document.getElementById("contextOverviewPanelV63");
        if (!panel || !snapshot) return;

        const selected = snapshot.selected || {};
        const ctx = snapshot.marketContext || {};

        panel.innerHTML = `
            <section class="v63-context-overview">
                <div class="v63-header">
                    <div>
                        <h2>Unified Context Store</h2>
                        <span>Revision ${snapshot.revision} · ${snapshot.reason || "state"}</span>
                    </div>
                    <strong>${selected.symbol || "—"}</strong>
                </div>

                <div class="v63-grid">
                    <div><small>Symbol</small><b>${selected.symbol || "—"}</b></div>
                    <div><small>Score</small><b>${Number(selected.score || 0).toFixed(1)}</b></div>
                    <div><small>Decision</small><b>${selected.decision || "—"}</b></div>
                    <div><small>Regime</small><b>${ctx.regime || "—"}</b></div>
                    <div><small>Permission</small><b>${ctx.tradePermission || "—"}</b></div>
                    <div><small>Context</small><b>${Number(ctx.contextScore || 0).toFixed(1)}</b></div>
                </div>
            </section>
        `;
    }

    function init() {
        window.WorkspaceRenderSchedulerV63?.register?.("contextOverviewPanelV63", render);
        window.MarketContextStoreV63?.subscribe?.(render);
    }

    window.ContextOverviewPanelV63 = { render, version: VERSION };
    document.addEventListener("DOMContentLoaded", () => setTimeout(init, 1700));
})();
