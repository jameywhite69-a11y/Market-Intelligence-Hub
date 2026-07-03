/*
Version 79.0 — Live Opportunity Tape
*/
(function () {
    const VERSION = "79.0";

    function render(payload) {
        const panel = document.getElementById("liveOpportunityTapePanelV79");
        if (!panel) return;

        const rows = payload?.opportunities || window.LiveOpportunityEngineV79?.latest?.() || [];

        panel.innerHTML = `
            <section class="v79-card">
                <div class="v79-header">
                    <div>
                        <h2>Live Opportunity Tape</h2>
                        <span>${rows.length} quote-scored candidates</span>
                    </div>
                    <strong>${rows[0]?.decision || "IDLE"}</strong>
                </div>

                <div class="v79-tape">
                    ${rows.slice(0, 12).map(o => `
                        <div class="${o.decision.toLowerCase()}">
                            <b>${o.symbol}</b>
                            <span>${o.price.toFixed(2)}</span>
                            <em>${o.score.toFixed(1)} · ${o.changePct >= 0 ? "+" : ""}${o.changePct.toFixed(2)}%</em>
                        </div>
                    `).join("") || "<div class='v79-empty'>No live opportunities yet.</div>"}
                </div>
            </section>
        `;
    }

    function wire() {
        window.EventBus?.subscribe?.("live-opportunities.updated", render);
        setTimeout(() => render(), 1900);
    }

    window.LiveOpportunityTapeV79 = { render, version: VERSION };
    document.addEventListener("DOMContentLoaded", () => setTimeout(wire, 1200));
})();
