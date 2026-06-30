/*
Version 42.8 — Professional Status Bar

Creates a unified workstation status strip.
*/

(function () {
    function renderProfessionalStatusBar() {
        const bar = document.getElementById("professionalStatusBarV42");
        if (!bar) return;

        const context = window.WorkspaceContext?.snapshot?.() || {};
        const modules = window.ModuleRegistry?.summary?.() || { healthy: 0, total: 0 };
        const execution = window.WorkspaceStore?.get?.("executionSnapshot") || {};
        const risk = window.WorkspaceStore?.get?.("institutionalRiskAssessment") || {};
        const market = context.marketData || "demo";
        const selected = context.symbol || "—";

        bar.innerHTML = `
            <div><b>Workspace</b><span>${context.workspace || "Professional"}</span></div>
            <div><b>Symbol</b><span>${selected}</span></div>
            <div><b>Broker</b><span>${context.broker || "paper"}</span></div>
            <div><b>Market Data</b><span>${market}</span></div>
            <div><b>Risk</b><span>${risk.decision || "Waiting"}</span></div>
            <div><b>Equity</b><span>$${Number(execution.equity || 0).toFixed(0)}</span></div>
            <div><b>Modules</b><span>${modules.healthy}/${modules.total}</span></div>
            <div><b>Version</b><span>42.8</span></div>
        `;
    }

    function ensureStatusBar() {
        if (document.getElementById("professionalStatusBarV42")) return;

        const existing = document.querySelector(".workspace-statusbar");
        if (!existing) return;

        const bar = document.createElement("div");
        bar.id = "professionalStatusBarV42";
        bar.className = "professional-statusbar-v42";
        existing.innerHTML = "";
        existing.appendChild(bar);

        renderProfessionalStatusBar();
    }

    window.EventBus?.subscribe?.("workspace.context.changed", renderProfessionalStatusBar);
    window.EventBus?.subscribe?.("module.registered", renderProfessionalStatusBar);
    window.EventBus?.subscribe?.("module.status.changed", renderProfessionalStatusBar);
    window.EventBus?.subscribe?.("risk.assessed", renderProfessionalStatusBar);
    window.EventBus?.subscribe?.("paper-order-filled", renderProfessionalStatusBar);
    window.EventBus?.subscribe?.("market-data:connected", renderProfessionalStatusBar);
    window.EventBus?.subscribe?.("market-data:disconnected", renderProfessionalStatusBar);

    document.addEventListener("DOMContentLoaded", () => {
        setTimeout(ensureStatusBar, 400);
        setInterval(renderProfessionalStatusBar, 5000);
    });

    window.ProfessionalStatusBarV42 = {
        ensureStatusBar,
        renderProfessionalStatusBar,
    };
})();
