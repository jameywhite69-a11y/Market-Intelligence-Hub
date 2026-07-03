/*
Version 81.0 — Stop / Target Manager
*/
(function () {
    const VERSION = "81.0";

    function render(payload) {
        const panel = document.getElementById("stopTargetManagerPanelV81");
        if (!panel) return;

        const model = payload || window.PositionRiskManagerV81?.analyze?.() || { positions: [] };

        panel.innerHTML = `
            <section class="v81-card">
                <div class="v81-header">
                    <div>
                        <h2>Stop / Target Manager</h2>
                        <span>distance to stop and profit targets</span>
                    </div>
                    <strong>${model.positions.length}</strong>
                </div>

                <div class="v81-target-list">
                    ${model.positions.map(p => `
                        <div>
                            <b>${p.symbol}</b>
                            <span>Stop ${Number(p.distanceToStopPct || 0).toFixed(2)}%</span>
                            <em>TP1 ${Number(p.distanceToTp1Pct || 0).toFixed(2)}%</em>
                        </div>
                    `).join("") || "<div class='v81-empty'>No active stops/targets.</div>"}
                </div>
            </section>
        `;
    }

    function wire() {
        window.EventBus?.subscribe?.("position-risk-v81.updated", render);
        setTimeout(() => render(), 1800);
    }

    window.StopTargetManagerV81 = { render, version: VERSION };
    document.addEventListener("DOMContentLoaded", () => setTimeout(wire, 1300));
})();
