/*
Version 81.0 — Position Lifecycle Dashboard
*/
(function () {
    const VERSION = "81.0";

    function render(payload) {
        const panel = document.getElementById("positionLifecycleDashboardV81");
        if (!panel) return;

        const model = payload || window.PositionRiskManagerV81?.analyze?.() || { positions: [] };

        panel.innerHTML = `
            <section class="v81-card">
                <div class="v81-header">
                    <div>
                        <h2>Position Lifecycle Dashboard</h2>
                        <span>${model.positions.length} actively managed paper positions</span>
                    </div>
                    <strong>LIVE</strong>
                </div>

                <div class="v81-position-list">
                    ${model.positions.map(p => `
                        <div class="${String(p.lifecycle).toLowerCase().replaceAll(" ", "-").replaceAll("/", "")}">
                            <b>${p.symbol}</b>
                            <span>${p.lifecycle}</span>
                            <em>${Number(p.rMultiple || 0).toFixed(2)}R</em>
                        </div>
                    `).join("") || "<div class='v81-empty'>No open paper positions.</div>"}
                </div>
            </section>
        `;
    }

    function wire() {
        window.EventBus?.subscribe?.("position-risk-v81.updated", render);
        setTimeout(() => render(), 1700);
    }

    window.PositionLifecycleDashboardV81 = { render, version: VERSION };
    document.addEventListener("DOMContentLoaded", () => setTimeout(wire, 1200));
})();
