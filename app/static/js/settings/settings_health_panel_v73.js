/*
Version 73.0 — Settings Health Panel
Validates local configuration safety.
*/
(function () {
    const VERSION = "73.0";

    function check() {
        const s = window.UnifiedSettingsStoreV73?.load?.() || {};
        const checks = [
            ["Paper Mode", s.execution?.mode === "paper"],
            ["Live Orders Blocked", s.execution?.allowLiveOrders !== true],
            ["Manual Approval Required", s.execution?.requireManualApproval === true],
            ["Risk Limit Present", Number(s.risk?.maxDailyRiskPct) > 0],
            ["AI Confidence Floor", Number(s.ai?.confidenceFloor) >= 50],
            ["Watchlist Configured", !!s.watchlist?.defaultSymbols]
        ];
        return checks;
    }

    function render() {
        const panel = document.getElementById("settingsHealthPanelV73");
        if (!panel) return;

        const checks = check();

        panel.innerHTML = `
            <section class="v73-card">
                <div class="v73-header">
                    <div>
                        <h2>Settings Health</h2>
                        <span>${checks.filter(x => x[1]).length}/${checks.length} checks passing</span>
                    </div>
                    <strong>${checks.every(x => x[1]) ? "SAFE" : "REVIEW"}</strong>
                </div>

                <div class="v73-check-list">
                    ${checks.map(([label, ok]) => `
                        <div class="${ok ? "pass" : "fail"}">
                            <b>${ok ? "✓" : "!"}</b>
                            <span>${label}</span>
                        </div>
                    `).join("")}
                </div>
            </section>
        `;
    }

    function wire() {
        window.EventBus?.subscribe?.("unified-settings.updated", render);
        setTimeout(render, 1800);
    }

    window.SettingsHealthPanelV73 = { check, render, version: VERSION };
    document.addEventListener("DOMContentLoaded", () => setTimeout(wire, 1300));
})();
