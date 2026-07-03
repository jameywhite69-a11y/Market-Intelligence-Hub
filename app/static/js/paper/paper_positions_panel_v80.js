/*
Version 80.0 — Paper Positions Panel
*/
(function () {
    const VERSION = "80.0";

    function render(payload) {
        const panel = document.getElementById("paperPositionsPanelV80");
        if (!panel) return;

        const s = payload?.account || window.PaperTradingAccountV80?.snapshot?.() || { positions: [] };
        const rows = (s.positions || []).slice(0, 10);

        panel.innerHTML = `
            <section class="v80-card">
                <div class="v80-header">
                    <div>
                        <h2>Paper Positions</h2>
                        <span>${rows.length} position records</span>
                    </div>
                    <strong>PAPER</strong>
                </div>

                <div class="v80-position-list">
                    ${rows.map(p => `
                        <div class="${String(p.status).toLowerCase()}">
                            <b>${p.symbol}</b>
                            <span>${p.qty} @ ${Number(p.entry).toFixed(2)}</span>
                            <em>$${Number(p.unrealizedPnl || p.realizedPnl || 0).toFixed(2)}</em>
                        </div>
                    `).join("") || "<div class='v80-empty'>No paper positions yet.</div>"}
                </div>
            </section>
        `;
    }

    function wire() {
        window.EventBus?.subscribe?.("paper-trading-account.updated", render);
        setTimeout(() => render(), 1800);
    }

    window.PaperPositionsPanelV80 = { render, version: VERSION };
    document.addEventListener("DOMContentLoaded", () => setTimeout(wire, 1300));
})();
