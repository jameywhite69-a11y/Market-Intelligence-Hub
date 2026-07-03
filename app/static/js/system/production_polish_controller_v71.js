/*
Version 71.0 — Production Polish Controller
Purpose:
- Clean production presentation.
- Hide noisy diagnostics unless developer mode is enabled.
- Add runtime status indicators.
- No broker execution.
*/
(function () {
    const VERSION = "71.0";
    const KEY = "mih.tios.production.mode.v71";

    function settings() {
        try {
            return JSON.parse(localStorage.getItem(KEY)) || { productionMode: true };
        } catch {
            return { productionMode: true };
        }
    }

    function save(next) {
        localStorage.setItem(KEY, JSON.stringify({ ...settings(), ...next }));
        apply();
    }

    function apply() {
        const s = settings();
        document.body.dataset.productionPolish = VERSION;
        document.body.dataset.productionMode = s.productionMode ? "true" : "false";

        const diagnosticSelectors = [
            "#startupTracePanel",
            "#startupOwnershipPanel",
            "#tiosLayoutManagerPanel",
            "#coreDiagnosticsPanel",
            "#eventDiagnosticsPanel",
            "#scannerDiagnostics",
            "#moduleRegistryPanel",
            "#workspaceHealthDashboardPanel"
        ];

        diagnosticSelectors.forEach(sel => {
            document.querySelectorAll(sel).forEach(el => {
                el.style.display = s.productionMode ? "none" : "";
            });
        });

        render();
    }

    function render() {
        const panel = document.getElementById("productionPolishPanelV71");
        if (!panel) return;

        const s = settings();
        const rc = window.ReleaseCandidateDashboardV70?.check?.();

        panel.innerHTML = `
            <section class="v71-card">
                <div class="v71-header">
                    <div>
                        <h2>Production Polish Controller</h2>
                        <span>presentation · diagnostics · release mode</span>
                    </div>
                    <strong>${s.productionMode ? "PRODUCTION VIEW" : "DEVELOPER VIEW"}</strong>
                </div>

                <div class="v71-grid">
                    <div><small>Diagnostics</small><b>${s.productionMode ? "Hidden" : "Visible"}</b></div>
                    <div><small>Release</small><b>${rc?.status || "Checking"}</b></div>
                    <div><small>Broker</small><b>Paper Safe</b></div>
                    <div><small>Version</small><b>${VERSION}</b></div>
                </div>

                <div class="v71-action-row">
                    <button id="v71ToggleProduction">${s.productionMode ? "Show Developer Panels" : "Hide Developer Panels"}</button>
                    <button id="v71RefreshPolish">Refresh View</button>
                </div>
            </section>
        `;

        document.getElementById("v71ToggleProduction")?.addEventListener("click", () => {
            save({ productionMode: !settings().productionMode });
        });

        document.getElementById("v71RefreshPolish")?.addEventListener("click", apply);
    }

    window.ProductionPolishControllerV71 = {
        apply,
        render,
        settings,
        save,
        version: VERSION
    };

    document.addEventListener("DOMContentLoaded", () => setTimeout(apply, 2200));
})();
